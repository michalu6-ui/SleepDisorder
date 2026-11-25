import type { BehavioralProfileId, DailyEntryMap, ProfileSuggestion, SuggestionReasonCode } from './types';
import { buildSevenDayView } from './sevenDayView';

function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function dayOfWeek(iso: string): number {
  return new Date(`${iso}T12:00:00`).getDay();
}

export function suggestProfileShift(
  daily: DailyEntryMap,
  behavioralId: BehavioralProfileId,
): Omit<ProfileSuggestion, 'schemaVersion' | 'createdAt' | 'dismissedUntil'> | null {
  const days = buildSevenDayView(daily);
  const weekdayWakes: number[] = [];
  const weekendWakes: number[] = [];
  let rescueNight = 0;
  let earlyWakes = 0;
  let roughMood = 0;

  for (const d of days) {
    const entry = daily[d.date];
    const wake = d.wakeTime ?? entry?.morning?.wakeTimeConfirmed;
    if (wake) {
      const mins = parseTime(wake);
      const dow = dayOfWeek(d.date);
      if (dow === 0 || dow === 6) weekendWakes.push(mins);
      else if (dow >= 1 && dow <= 5) weekdayWakes.push(mins);
    }
    if (entry?.rescueUsedAt?.length) {
      for (const at of entry.rescueUsedAt) {
        const h = new Date(at).getHours();
        if (h >= 1 && h <= 4) rescueNight += 1;
      }
    }
    if (d.mood === 'rough') roughMood += 1;
    if (wake && parseTime(wake) < 5 * 60 + 30) earlyWakes += 1;
  }

  if (weekdayWakes.length >= 2 && weekendWakes.length >= 2) {
    const avgWd = weekdayWakes.reduce((a, b) => a + b, 0) / weekdayWakes.length;
    const avgWe = weekendWakes.reduce((a, b) => a + b, 0) / weekendWakes.length;
    if (avgWe - avgWd >= 90 && behavioralId !== 'weekend-shuttle') {
      return {
        suggestedProfileId: 'weekend-shuttle',
        reasonCode: 'R1',
        messagePl: 'Różnica pobudek w weekendy wygląda na dużą — profil „Weekendowy wahadłowiec” może lepiej pasować.',
      };
    }
  }

  if (rescueNight >= 3 && behavioralId !== 'light-sleeper') {
    return {
      suggestedProfileId: 'light-sleeper',
      reasonCode: 'R2',
      messagePl: 'Kilka razy w nocy sięgałeś/aś po tryb ratunkowy — sprawdźmy profil „Płytki sen”.',
    };
  }

  if (earlyWakes >= 4 && behavioralId !== 'early-bird-flat') {
    return {
      suggestedProfileId: 'early-bird-flat',
      reasonCode: 'R3',
      messagePl: 'Często wstajesz bardzo wcześnie — „Wczesny ptak bez baterii” może lepiej dopasować kroki.',
    };
  }

  if (roughMood >= 4 && behavioralId !== 'evening-wired') {
    return {
      suggestedProfileId: 'evening-wired',
      reasonCode: 'R5',
      messagePl: 'Ostatnie dni były ciężkie wieczorem — warto spojrzeć na profil „Przebodźcowany wieczorem”.',
    };
  }

  return null;
}

export function reasonLabel(code: SuggestionReasonCode): string {
  const map: Record<SuggestionReasonCode, string> = {
    R1: 'Rytm weekendowy',
    R2: 'Nocne wybudzenia',
    R3: 'Wczesne pobudki',
    R4: 'Późne wieczory',
    R5: 'Wieczorne pobudzenie',
  };
  return map[code];
}
import type { DailyEntryMap, MoodIcon, ProfileId } from '../domain/types';
import { todayDateString } from '../domain/sevenDayView';

const MOODS: MoodIcon[] = ['great', 'ok', 'tired', 'rough'];

function formatDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function seedDemoData(_profileId: ProfileId): DailyEntryMap {
  const map: DailyEntryMap = {};
  for (let i = 6; i >= 0; i--) {
    const date = formatDateOffset(i);
    const mood = MOODS[(6 - i) % MOODS.length];
    const morning = i !== 3;
    const evening = i !== 5;
    map[date] = {
      schemaVersion: 1,
      date,
      morning: morning
        ? {
            mood,
            wakeTimeConfirmed: '07:45',
            morningLightDone: i % 2 === 0,
          }
        : undefined,
      evening: evening ? { stepsCompleted: ['demo-step-1'], completedAt: new Date().toISOString() } : undefined,
      anchorsDone: { morning, evening },
    };
  }
  void todayDateString();
  return map;
}
import type { DailyEntryMap, SevenDayDaySummary } from './types';

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildSevenDayView(daily: DailyEntryMap, reference: Date = new Date()): SevenDayDaySummary[] {
  const days: SevenDayDaySummary[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(reference);
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    const entry = daily[key];
    days.push({
      date: key,
      mood: entry?.morning?.mood,
      wakeTime: entry?.morning?.wakeTimeConfirmed,
      morningAnchor: entry?.anchorsDone.morning ?? false,
      eveningAnchor: entry?.anchorsDone.evening ?? false,
    });
  }
  return days;
}

export function todayDateString(date: Date = new Date()): string {
  return formatDate(date);
}
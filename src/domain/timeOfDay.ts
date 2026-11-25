import type { TimeOfDay } from './types';

export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function resolveTimeOfDay(override: TimeOfDay | null | undefined, now: Date = new Date()): TimeOfDay {
  if (override) return override;
  return getTimeOfDayFromHour(now.getHours());
}

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: 'Poranek',
  day: 'Dzień',
  evening: 'Wieczór',
  night: 'Noc',
  rescue: 'Spokój',
};
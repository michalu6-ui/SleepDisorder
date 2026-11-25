import { getHabitPack } from './habitPacks';
import type { DailyEntry, ProfileId } from './types';

export function isMorningAnchorComplete(entry: DailyEntry, profileId: ProfileId): boolean {
  const pack = getHabitPack(profileId);
  const steps = pack.morning.steps;
  if (!entry.morning?.mood) return false;
  if (steps.includes('wake-time') && !entry.morning.wakeTimeConfirmed) return false;
  if (steps.includes('morning-light') && !entry.morning.morningLightDone) return false;
  return true;
}

export function isEveningAnchorComplete(entry: DailyEntry, profileId: ProfileId): boolean {
  const pack = getHabitPack(profileId);
  const required = pack.evening.steps.map((s) => s.id);
  const done = entry.evening?.stepsCompleted ?? [];
  return required.length > 0 && required.every((id) => done.includes(id));
}
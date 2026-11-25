import type { AppSettings, ProfileState } from '../domain/types';

type LegacyProfile = {
  schemaVersion?: number;
  profileId?: string;
  profileSource?: string;
  quizAnswers?: ProfileState['quizAnswers'];
  profileAssignedAt?: string;
};

export function migrateSettings(raw: AppSettings & { hasSeenProfileExplainer?: boolean }): AppSettings {
  return {
    ...raw,
    schemaVersion: 2,
    hasSeenProfileExplainer: raw.hasSeenProfileExplainer ?? false,
  };
}

export function migrateProfile(raw: LegacyProfile & ProfileState): ProfileState {
  if (raw.activeProfileId && raw.behavioralProfileId) {
    return { ...raw, schemaVersion: 2, profileHistory: raw.profileHistory ?? [] };
  }
  const legacyId = (raw.profileId ?? raw.activeProfileId ?? 'night-thinker') as import('../domain/types').ActiveProfileId;
  const safety = legacyId === 'safety-path';
  const behavioral: ProfileState['behavioralProfileId'] = safety
    ? 'night-thinker'
    : (legacyId as ProfileState['behavioralProfileId']);
  return {
    schemaVersion: 2,
    activeProfileId: legacyId,
    behavioralProfileId: behavioral,
    safetyActive: safety,
    profileSource: (raw.profileSource as ProfileState['profileSource']) ?? 'quiz',
    quizAnswers: raw.quizAnswers,
    profileAssignedAt: raw.profileAssignedAt ?? new Date().toISOString(),
    profileHistory: [],
  };
}
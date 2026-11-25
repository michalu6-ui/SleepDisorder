import type { AppSettings, ProfileState, StreakState, StorageMeta } from '../domain/types';
import { createInitialStreak } from '../domain/streak';

export function createDefaultSettings(): AppSettings {
  return {
    schemaVersion: 2,
    onboardingCompleted: false,
    hasSeenProfileExplainer: false,
    locale: 'pl',
    phoneFrameEnabled: true,
    timeOfDayOverride: null,
    anchorTimes: {
      wakeTime: '07:30',
      windDownTime: '22:30',
      weekendWakeLatest: '10:00',
    },
    audio: {
      breathSoundEnabled: false,
      rescueSoundEnabled: true,
      volume: 0.35,
    },
    haptics: {
      breathPulseEnabled: false,
    },
    developer: {
      seedDemoOnFirstRun: false,
      showDebugPanel: false,
    },
  };
}

export function createDefaultProfile(): ProfileState {
  return {
    schemaVersion: 2,
    activeProfileId: 'night-thinker',
    behavioralProfileId: 'night-thinker',
    safetyActive: false,
    profileSource: 'quiz',
    profileAssignedAt: new Date().toISOString(),
    profileHistory: [],
  };
}

export function createDefaultMeta(): StorageMeta {
  return {
    schemaVersion: 2,
    installId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export function createDefaultStreak(): StreakState {
  return createInitialStreak();
}
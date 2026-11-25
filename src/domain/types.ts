export type SchemaVersion = 1 | 2;

export type BehavioralProfileId =
  | 'night-thinker'
  | 'light-sleeper'
  | 'early-bird-flat'
  | 'city-owl'
  | 'weekend-shuttle'
  | 'evening-wired';

export type ActiveProfileId = BehavioralProfileId | 'safety-path';

/** Aktywny profil w UI (6 behawioralnych + ścieżka bezpieczeństwa) */
export type ProfileId = ActiveProfileId;

export type ProfileSource = 'quiz' | 'manual' | 'recalibration' | 'suggested';

export type QuizQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

export type QuizAnswers = Partial<Record<QuizQuestionId, string>>;

export type RecalibrationQuestionId = 'rc1' | 'rc2' | 'rc3';

export type RecalibrationAnswers = Partial<Record<RecalibrationQuestionId, string>>;

export type SuggestionReasonCode = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export type MoodIcon = 'great' | 'ok' | 'tired' | 'rough';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night' | 'rescue';

export type MorningStepId = 'mood' | 'wake-time' | 'morning-light';

export interface ProfileChangeEvent {
  at: string;
  from: ActiveProfileId;
  to: ActiveProfileId;
  source: ProfileSource;
}

export interface ProfileSuggestion {
  schemaVersion: SchemaVersion;
  suggestedProfileId: BehavioralProfileId;
  reasonCode: SuggestionReasonCode;
  messagePl: string;
  createdAt: string;
  dismissedUntil?: string;
}

export interface StorageMeta {
  schemaVersion: SchemaVersion;
  installId: string;
  createdAt: string;
  lastSeedAt?: string;
}

export interface AnchorTimes {
  wakeTime: string;
  windDownTime: string;
  weekendWakeLatest?: string;
}

export interface AppSettings {
  schemaVersion: SchemaVersion;
  onboardingCompleted: boolean;
  hasSeenProfileExplainer: boolean;
  locale: 'pl';
  phoneFrameEnabled: boolean;
  timeOfDayOverride?: TimeOfDay | null;
  anchorTimes: AnchorTimes;
  audio: {
    breathSoundEnabled: boolean;
    rescueSoundEnabled: boolean;
    volume: number;
  };
  haptics: {
    breathPulseEnabled: boolean;
  };
  developer: {
    seedDemoOnFirstRun: boolean;
    showDebugPanel: boolean;
  };
}

export interface ProfileState {
  schemaVersion: SchemaVersion;
  activeProfileId: ActiveProfileId;
  behavioralProfileId: BehavioralProfileId;
  safetyActive: boolean;
  profileSource: ProfileSource;
  quizAnswers?: QuizAnswers;
  recalibrationAnswers?: RecalibrationAnswers;
  lastRecalibratedAt?: string;
  profileAssignedAt: string;
  profileHistory: ProfileChangeEvent[];
  displayName?: string;
  /** @deprecated v1 — migracja */
  profileId?: ActiveProfileId;
}

export interface DailyEntry {
  schemaVersion: SchemaVersion;
  date: string;
  morning?: {
    mood?: MoodIcon;
    wakeTimeConfirmed?: string;
    morningLightDone?: boolean;
    completedAt?: string;
  };
  evening?: {
    stepsCompleted: string[];
    completedAt?: string;
  };
  anchorsDone: {
    morning: boolean;
    evening: boolean;
  };
  rescueUsedAt?: string[];
}

export type DailyEntryMap = Record<string, DailyEntry>;

export type BrainDumpStatus = 'draft' | 'vaulting' | 'vaulted';

export interface BrainDumpEntry {
  schemaVersion: SchemaVersion;
  id: string;
  date: string;
  promptGeneral: string;
  answerGeneral: string;
  promptProfile: string;
  answerProfile: string;
  status: BrainDumpStatus;
  createdAt: string;
  vaultedAt?: string;
}

export interface StreakState {
  schemaVersion: SchemaVersion;
  currentRun: number;
  longestRun: number;
  lastMorningAnchorDate?: string;
  totalMorningAnchors: number;
}

export interface SevenDayDaySummary {
  date: string;
  mood?: MoodIcon;
  wakeTime?: string;
  morningAnchor: boolean;
  eveningAnchor: boolean;
}

export interface EveningStepTemplate {
  id: string;
  titlePl: string;
  descriptionPl: string;
  deepLink?: 'brain-dump' | 'breath';
}

export interface MorningAnchorConfig {
  steps: MorningStepId[];
  highlightedStep?: MorningStepId;
}

export interface EveningLandingConfig {
  steps: EveningStepTemplate[];
  weekendVariant?: EveningStepTemplate[];
}

export interface HabitPack {
  profileId: ActiveProfileId;
  morning: MorningAnchorConfig;
  evening: EveningLandingConfig;
  suggestedTools: Array<'brain-dump' | 'breath'>;
  starterHabits?: string[];
  defaultWakeTime?: string;
  defaultWindDownTime?: string;
}

export interface ResolvedProfile {
  behavioralProfileId: BehavioralProfileId;
  safetyActive: boolean;
  activeProfileId: ActiveProfileId;
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ActiveProfileId,
  AppSettings,
  BrainDumpEntry,
  DailyEntry,
  DailyEntryMap,
  ProfileId,
  ProfileState,
  ProfileSuggestion,
  QuizAnswers,
  RecalibrationAnswers,
  StreakState,
} from '../../domain/types';
import { getActiveProfileId } from '../../domain/profileResolve';
import { resolveFromRecalibration } from '../../domain/recalibrationMatrix';
import { resolveProfileFromQuiz, scoreBehavioralProfile } from '../../domain/ruleEngine';
import { suggestProfileShift } from '../../domain/suggestProfileShift';
import { getBrainDumpPrompts, getHabitPack } from '../../domain/habitPacks';
import { isEveningAnchorComplete } from '../../domain/dailyChecks';
import { updateStreakAfterMorning } from '../../domain/streak';
import { todayDateString } from '../../domain/sevenDayView';
import { createDefaultMeta, createDefaultProfile, createDefaultSettings, createDefaultStreak } from '../../storage/defaults';
import { loadJson, saveJson, clearAllKotwicaData } from '../../storage/persist';
import { seedDemoData } from '../../storage/seedDemo';
import { STORAGE_KEYS } from '../../storage/keys';
import { migrateProfile, migrateSettings } from '../../storage/migrate';

interface StorageContextValue {
  ready: boolean;
  settings: AppSettings;
  profile: ProfileState;
  daily: DailyEntryMap;
  brainDumps: BrainDumpEntry[];
  streak: StreakState;
  updateSettings: (patch: Partial<AppSettings> | ((s: AppSettings) => AppSettings)) => void;
  completeOnboarding: (answers: QuizAnswers) => void;
  setProfileManual: (id: ProfileId) => void;
  getTodayEntry: () => DailyEntry;
  updateToday: (mutator: (entry: DailyEntry) => DailyEntry) => void;
  completeMorningAnchor: () => void;
  toggleEveningStep: (stepId: string) => void;
  saveBrainDump: (general: string, profileAnswer: string) => BrainDumpEntry;
  vaultBrainDump: (id: string) => void;
  resetAll: (options?: { reseed?: boolean; keepFrame?: boolean }) => void;
  seedDemo: () => void;
  suggestion: ProfileSuggestion | null;
  dismissSuggestion: () => void;
  acceptSuggestion: () => void;
  recalibrateProfile: (answers: RecalibrationAnswers) => void;
  recordRescueUse: () => void;
  applyProfileChange: (id: ActiveProfileId, source: ProfileState['profileSource']) => void;
}

const StorageContext = createContext<StorageContextValue | null>(null);

function ensureTodayEntry(map: DailyEntryMap, date: string): DailyEntry {
  if (!map[date]) {
    map[date] = {
      schemaVersion: 1,
      date,
      anchorsDone: { morning: false, evening: false },
    };
  }
  return map[date];
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(createDefaultSettings);
  const [profile, setProfile] = useState<ProfileState>(createDefaultProfile);
  const [daily, setDaily] = useState<DailyEntryMap>({});
  const [brainDumps, setBrainDumps] = useState<BrainDumpEntry[]>([]);
  const [streak, setStreak] = useState<StreakState>(createDefaultStreak);
  const [suggestion, setSuggestion] = useState<ProfileSuggestion | null>(null);

  useEffect(() => {
    loadJson(STORAGE_KEYS.meta, createDefaultMeta());
    const rawSettings = loadJson(STORAGE_KEYS.settings, createDefaultSettings());
  setSettings(migrateSettings(rawSettings));
    const rawProfile = loadJson(STORAGE_KEYS.profile, createDefaultProfile());
    setProfile(migrateProfile(rawProfile));
    const loadedDaily = loadJson(STORAGE_KEYS.daily, {});
    setDaily(loadedDaily);
    setBrainDumps(loadJson(STORAGE_KEYS.brainDumps, []));
    setStreak(loadJson(STORAGE_KEYS.streak, createDefaultStreak()));
    const loadedSuggestion = loadJson<ProfileSuggestion | null>(STORAGE_KEYS.suggestion, null);
    setSuggestion(loadedSuggestion);
    const migratedProfile = migrateProfile(rawProfile);
    const maybe = suggestProfileShift(loadedDaily, migratedProfile.behavioralProfileId);
    if (maybe && !loadedSuggestion?.dismissedUntil) {
      const next: ProfileSuggestion = {
        schemaVersion: 2,
        ...maybe,
        createdAt: new Date().toISOString(),
      };
      setSuggestion(next);
      saveJson(STORAGE_KEYS.suggestion, next);
    }
    setReady(true);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings> | ((s: AppSettings) => AppSettings)) => {
      setSettings((prev) => {
        const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
        saveJson(STORAGE_KEYS.settings, next);
        return next;
      });
    },
    [],
  );

  const applyProfileChange = useCallback(
    (id: ActiveProfileId, source: ProfileState['profileSource']) => {
      const safety = id === 'safety-path';
      const behavioral =
        id === 'safety-path' ? profile.behavioralProfileId : (id as ProfileState['behavioralProfileId']);
      const event = {
        at: new Date().toISOString(),
        from: getActiveProfileId(profile),
        to: id,
        source,
      };
      const next: ProfileState = {
        ...profile,
        schemaVersion: 2,
        activeProfileId: id,
        behavioralProfileId: behavioral,
        safetyActive: safety,
        profileSource: source,
        profileAssignedAt: new Date().toISOString(),
        profileHistory: [...profile.profileHistory, event],
      };
      setProfile(next);
      saveJson(STORAGE_KEYS.profile, next);
    },
    [profile],
  );

  const completeOnboarding = useCallback(
    (answers: QuizAnswers) => {
      const resolved = resolveProfileFromQuiz(answers);
      const pack = getHabitPack(resolved.activeProfileId);
      const nextProfile: ProfileState = {
        schemaVersion: 2,
        activeProfileId: resolved.activeProfileId,
        behavioralProfileId: resolved.behavioralProfileId,
        safetyActive: resolved.safetyActive,
        profileSource: 'quiz',
        quizAnswers: answers,
        profileAssignedAt: new Date().toISOString(),
        profileHistory: [
          {
            at: new Date().toISOString(),
            from: 'night-thinker',
            to: resolved.activeProfileId,
            source: 'quiz',
          },
        ],
      };
      setProfile(nextProfile);
      setSettings((prev) => {
        const next: AppSettings = {
          ...prev,
          onboardingCompleted: true,
          anchorTimes: {
            ...prev.anchorTimes,
            wakeTime: pack.defaultWakeTime ?? prev.anchorTimes.wakeTime,
            windDownTime: pack.defaultWindDownTime ?? prev.anchorTimes.windDownTime,
          },
        };
        saveJson(STORAGE_KEYS.settings, next);
        saveJson(STORAGE_KEYS.profile, nextProfile);
        if (prev.developer.seedDemoOnFirstRun) {
          const demo = seedDemoData(resolved.activeProfileId);
          setDaily(demo);
          saveJson(STORAGE_KEYS.daily, demo);
        }
        return next;
      });
    },
    [],
  );

  const setProfileManual = useCallback(
    (id: ProfileId) => {
      applyProfileChange(id, 'manual');
    },
    [applyProfileChange],
  );

  const recalibrateProfile = useCallback(
    (rcAnswers: RecalibrationAnswers) => {
      const baseScores = profile.quizAnswers
        ? scoreBehavioralProfile(profile.quizAnswers)
        : scoreBehavioralProfile({});
      const behavioral = resolveFromRecalibration(baseScores, rcAnswers);
      const next: ProfileState = {
        ...profile,
        behavioralProfileId: behavioral,
        activeProfileId: profile.safetyActive ? 'safety-path' : behavioral,
        recalibrationAnswers: rcAnswers,
        lastRecalibratedAt: new Date().toISOString(),
        profileSource: 'recalibration',
        profileHistory: [
          ...profile.profileHistory,
          {
            at: new Date().toISOString(),
            from: getActiveProfileId(profile),
            to: profile.safetyActive ? 'safety-path' : behavioral,
            source: 'recalibration',
          },
        ],
      };
      setProfile(next);
      saveJson(STORAGE_KEYS.profile, next);
    },
    [profile],
  );

  const dismissSuggestion = useCallback(() => {
    const until = new Date();
    until.setDate(until.getDate() + 7);
    const next: ProfileSuggestion | null = suggestion
      ? { ...suggestion, dismissedUntil: until.toISOString() }
      : null;
    setSuggestion(next);
    saveJson(STORAGE_KEYS.suggestion, next);
  }, [suggestion]);

  const acceptSuggestion = useCallback(() => {
    if (!suggestion) return;
    applyProfileChange(suggestion.suggestedProfileId, 'suggested');
    setSuggestion(null);
    saveJson(STORAGE_KEYS.suggestion, null);
  }, [suggestion, applyProfileChange]);

  const getTodayEntry = useCallback(() => {
    const date = todayDateString();
    return ensureTodayEntry({ ...daily }, date);
  }, [daily]);

  const updateToday = useCallback(
    (mutator: (entry: DailyEntry) => DailyEntry) => {
      const date = todayDateString();
      setDaily((prev) => {
        const copy = { ...prev };
        const entry = mutator(ensureTodayEntry(copy, date));
        copy[date] = entry;
        saveJson(STORAGE_KEYS.daily, copy);
        return copy;
      });
    },
    [],
  );

  const recordRescueUse = useCallback(() => {
    const at = new Date().toISOString();
    updateToday((entry) => ({
      ...entry,
      rescueUsedAt: [...(entry.rescueUsedAt ?? []), at],
    }));
  }, [updateToday]);

  const completeMorningAnchor = useCallback(() => {
    const date = todayDateString();
    updateToday((entry) => {
      const next = { ...entry, anchorsDone: { ...entry.anchorsDone, morning: true } };
      return next;
    });
    setStreak((prev) => {
      const next = updateStreakAfterMorning(prev, date);
      saveJson(STORAGE_KEYS.streak, next);
      return next;
    });
  }, [updateToday]);

  const toggleEveningStep = useCallback(
    (stepId: string) => {
      updateToday((entry) => {
        const steps = new Set(entry.evening?.stepsCompleted ?? []);
        if (steps.has(stepId)) steps.delete(stepId);
        else steps.add(stepId);
        const evening = { stepsCompleted: [...steps] };
        const anchorsDone = {
          ...entry.anchorsDone,
          evening: isEveningAnchorComplete({ ...entry, evening }, getActiveProfileId(profile)),
        };
        return { ...entry, evening, anchorsDone };
      });
    },
    [updateToday, profile.profileId],
  );

  const saveBrainDump = useCallback(
    (general: string, profileAnswer: string) => {
      const date = todayDateString();
      const prompts = getBrainDumpPrompts(getActiveProfileId(profile));
      const entry: BrainDumpEntry = {
        schemaVersion: 1,
        id: crypto.randomUUID(),
        date,
        promptGeneral: prompts.general,
        answerGeneral: general,
        promptProfile: prompts.profile,
        answerProfile: profileAnswer,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      setBrainDumps((prev) => {
        const next = [entry, ...prev].slice(0, 14);
        saveJson(STORAGE_KEYS.brainDumps, next);
        return next;
      });
      return entry;
    },
    [profile],
  );

  const vaultBrainDump = useCallback((id: string) => {
    setBrainDumps((prev) => {
      const next = prev.map((b) =>
        b.id === id
          ? { ...b, status: 'vaulted' as const, vaultedAt: new Date().toISOString() }
          : b,
      );
      saveJson(STORAGE_KEYS.brainDumps, next);
      return next;
    });
  }, []);

  const resetAll = useCallback(
    (options?: { reseed?: boolean; keepFrame?: boolean }) => {
      const frame = options?.keepFrame ? settings.phoneFrameEnabled : undefined;
      clearAllKotwicaData();
      const freshSettings = createDefaultSettings();
      if (frame !== undefined) freshSettings.phoneFrameEnabled = frame;
      const freshProfile = createDefaultProfile();
      setSettings(freshSettings);
      setProfile(freshProfile);
      setDaily({});
      setBrainDumps([]);
      setStreak(createDefaultStreak());
      saveJson(STORAGE_KEYS.settings, freshSettings);
      saveJson(STORAGE_KEYS.profile, freshProfile);
      saveJson(STORAGE_KEYS.daily, {});
      saveJson(STORAGE_KEYS.brainDumps, []);
      saveJson(STORAGE_KEYS.streak, createDefaultStreak());
      if (options?.reseed) {
        const demo = seedDemoData(freshProfile.activeProfileId);
        setDaily(demo);
        saveJson(STORAGE_KEYS.daily, demo);
      }
    },
    [settings.phoneFrameEnabled],
  );

  const seedDemo = useCallback(() => {
    const demo = seedDemoData(getActiveProfileId(profile));
    setDaily(demo);
    saveJson(STORAGE_KEYS.daily, demo);
  }, [profile]);

  const value = useMemo<StorageContextValue>(
    () => ({
      ready,
      settings,
      profile,
      daily,
      brainDumps,
      streak,
      updateSettings,
      completeOnboarding,
      setProfileManual,
      getTodayEntry,
      updateToday,
      completeMorningAnchor,
      toggleEveningStep,
      saveBrainDump,
      vaultBrainDump,
      resetAll,
      seedDemo,
      suggestion,
      dismissSuggestion,
      acceptSuggestion,
      recalibrateProfile,
      recordRescueUse,
      applyProfileChange,
    }),
    [
      ready,
      settings,
      profile,
      daily,
      brainDumps,
      streak,
      updateSettings,
      completeOnboarding,
      setProfileManual,
      getTodayEntry,
      updateToday,
      completeMorningAnchor,
      toggleEveningStep,
      saveBrainDump,
      vaultBrainDump,
      resetAll,
      seedDemo,
      suggestion,
      dismissSuggestion,
      acceptSuggestion,
      recalibrateProfile,
      recordRescueUse,
      applyProfileChange,
    ],
  );

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
}
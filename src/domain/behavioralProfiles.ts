import type { BehavioralProfileId } from './types';

export const BEHAVIORAL_PROFILE_IDS: BehavioralProfileId[] = [
  'night-thinker',
  'light-sleeper',
  'early-bird-flat',
  'city-owl',
  'weekend-shuttle',
  'evening-wired',
];

export const BEHAVIORAL_PRIORITY: BehavioralProfileId[] = [...BEHAVIORAL_PROFILE_IDS];

export function zeroBehavioralScores(): Record<BehavioralProfileId, number> {
  return {
    'night-thinker': 0,
    'light-sleeper': 0,
    'early-bird-flat': 0,
    'city-owl': 0,
    'weekend-shuttle': 0,
    'evening-wired': 0,
  };
}
import type { BehavioralProfileId, ProfileState } from './types';
import { BEHAVIORAL_PRIORITY } from './behavioralProfiles';

export function argMaxFromScores(scores: Record<BehavioralProfileId, number>): BehavioralProfileId {
  const top = Math.max(...BEHAVIORAL_PRIORITY.map((id) => scores[id]));
  for (const id of BEHAVIORAL_PRIORITY) {
    if (scores[id] === top) return id;
  }
  return BEHAVIORAL_PRIORITY[0];
}

export function getActiveProfileId(profile: ProfileState): ProfileState['activeProfileId'] {
  if (profile.safetyActive) return 'safety-path';
  return profile.activeProfileId === 'safety-path' ? profile.behavioralProfileId : profile.activeProfileId;
}
import type { BehavioralProfileId, RecalibrationAnswers } from './types';
import { zeroBehavioralScores } from './behavioralProfiles';
import { argMaxFromScores } from './profileResolve';

export interface RecalibrationOption {
  id: string;
  labelPl: string;
  weights: Partial<Record<BehavioralProfileId, number>>;
}

export interface RecalibrationQuestion {
  id: 'rc1' | 'rc2' | 'rc3';
  titlePl: string;
  options: RecalibrationOption[];
}

export const RECALIBRATION_QUESTIONS: RecalibrationQuestion[] = [
  {
    id: 'rc1',
    titlePl: 'Różnica pobudek: tydzień vs weekend',
    options: [
      { id: 'rc1-same', labelPl: 'Podobnie', weights: {} },
      { id: 'rc1-mid', labelPl: 'Ok. 30–60 min', weights: { 'weekend-shuttle': 1 } },
      { id: 'rc1-big', labelPl: 'Więcej niż 60 min', weights: { 'weekend-shuttle': 3 } },
      { id: 'rc1-late', labelPl: 'Weekend bardzo późno', weights: { 'weekend-shuttle': 2, 'city-owl': 1 } },
    ],
  },
  {
    id: 'rc2',
    titlePl: 'Główna trudność z ostatnich 7 dni',
    options: [
      { id: 'rc2-thoughts', labelPl: 'Myśli wieczorem', weights: { 'night-thinker': 2 } },
      { id: 'rc2-wake', labelPl: 'Budzenia w nocy', weights: { 'light-sleeper': 2 } },
      { id: 'rc2-early', labelPl: 'Za wczesne wstawanie', weights: { 'early-bird-flat': 2 } },
      { id: 'rc2-late', labelPl: 'Późny rytm', weights: { 'city-owl': 2 } },
      { id: 'rc2-weekend', labelPl: 'Rozjazd weekend', weights: { 'weekend-shuttle': 2 } },
      { id: 'rc2-wired', labelPl: 'Pobudzenie wieczorem', weights: { 'evening-wired': 2 } },
    ],
  },
  {
    id: 'rc3',
    titlePl: 'Kofeina / ekran w łóżku po 20:00',
    options: [
      { id: 'rc3-yes', labelPl: 'Tak', weights: { 'evening-wired': 3 } },
      { id: 'rc3-sometimes', labelPl: 'Czasem', weights: { 'evening-wired': 1, 'night-thinker': 1 } },
      { id: 'rc3-no', labelPl: 'Nie', weights: {} },
    ],
  },
];

export function scoreRecalibration(answers: RecalibrationAnswers): Record<BehavioralProfileId, number> {
  const scores = zeroBehavioralScores();
  for (const q of RECALIBRATION_QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) continue;
    for (const [id, w] of Object.entries(opt.weights) as [BehavioralProfileId, number][]) {
      scores[id] += w;
    }
  }
  return scores;
}

export function mergeScores(
  base: Record<BehavioralProfileId, number>,
  extra: Record<BehavioralProfileId, number>,
): Record<BehavioralProfileId, number> {
  const next = { ...base };
  for (const id of Object.keys(next) as BehavioralProfileId[]) {
    next[id] += extra[id];
  }
  return next;
}

export function resolveFromRecalibration(
  quizScores: Record<BehavioralProfileId, number>,
  rcAnswers: RecalibrationAnswers,
): BehavioralProfileId {
  const merged = mergeScores(quizScores, scoreRecalibration(rcAnswers));
  return argMaxFromScores(merged);
}
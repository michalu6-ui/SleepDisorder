import type { BehavioralProfileId, QuizQuestionId } from './types';
import { BEHAVIORAL_META } from './profileMeta';
import { zeroBehavioralScores } from './behavioralProfiles';

export type QuizWeights = Record<BehavioralProfileId, number>;

export interface QuizOption {
  id: string;
  labelPl: string;
  weights: QuizWeights;
  safetyFlag?: boolean;
  tieBreakBonus?: Partial<Record<BehavioralProfileId, number>>;
}

export interface QuizQuestion {
  id: QuizQuestionId;
  titlePl: string;
  iconHint: string;
  options: QuizOption[];
}

const W = zeroBehavioralScores;

function w(partial: Partial<QuizWeights>): QuizWeights {
  return { ...W(), ...partial };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    iconHint: 'księżyc',
    titlePl: 'Co najbardziej opisuje wieczorne zasypianie?',
    options: [
      {
        id: 'q1-thoughts',
        labelPl: 'Gonitwa myśli — trudno „wyłączyć” głowę',
        weights: w({ 'night-thinker': 3, 'evening-wired': 1 }),
      },
      {
        id: 'q1-long',
        labelPl: 'Długo zasypiam, ale potem śpię do rana',
        weights: w({ 'night-thinker': 2, 'evening-wired': 2, 'city-owl': 1 }),
      },
      {
        id: 'q1-wake',
        labelPl: 'Budzę się w nocy i trudno znów usnąć',
        weights: w({ 'light-sleeper': 3, 'weekend-shuttle': 1 }),
      },
      {
        id: 'q1-late',
        labelPl: 'Zasypiam bardzo późno, choć jestem zmęczony/a',
        weights: w({ 'city-owl': 3, 'evening-wired': 2 }),
      },
      {
        id: 'q1-varies',
        labelPl: 'Zależy od dnia',
        weights: w({ 'weekend-shuttle': 3, 'city-owl': 1 }),
      },
    ],
  },
  {
    id: 'q2',
    iconHint: 'noc',
    titlePl: 'Co dzieje się w środku nocy?',
    options: [
      {
        id: 'q2-clock',
        labelPl: 'Budzę się i sprawdzam godzinę',
        weights: w({ 'light-sleeper': 3, 'night-thinker': 1 }),
      },
      {
        id: 'q2-early',
        labelPl: 'Budzę się za wcześnie i nie mogę już spać',
        weights: w({ 'early-bird-flat': 3, 'light-sleeper': 1 }),
      },
      {
        id: 'q2-brief',
        labelPl: 'Krótko się budzę, potem znów śpię',
        weights: w({ 'light-sleeper': 2, 'night-thinker': 1 }),
      },
      {
        id: 'q2-rare',
        labelPl: 'Rzadko się budzę',
        weights: w({ 'city-owl': 1, 'evening-wired': 1 }),
      },
      {
        id: 'q2-weekend',
        labelPl: 'Inaczej w tygodniu niż w weekend',
        weights: w({ 'weekend-shuttle': 3 }),
      },
    ],
  },
  {
    id: 'q3',
    iconHint: 'wschód słońca',
    titlePl: 'Poranek bez budzika wyglądałby tak…',
    options: [
      {
        id: 'q3-early',
        labelPl: 'Ok. 5:00–6:30',
        weights: w({ 'early-bird-flat': 3 }),
      },
      {
        id: 'q3-mid',
        labelPl: 'Ok. 7:00–8:30',
        weights: w({ 'night-thinker': 1, 'light-sleeper': 1, 'weekend-shuttle': 1 }),
      },
      {
        id: 'q3-late',
        labelPl: 'Po 9:00',
        weights: w({ 'city-owl': 3, 'evening-wired': 1 }),
      },
      {
        id: 'q3-shift',
        labelPl: 'Mocno się przesuwa',
        weights: w({ 'weekend-shuttle': 2, 'evening-wired': 2 }),
      },
    ],
  },
  {
    id: 'q4',
    iconHint: 'rytm',
    titlePl: 'Co najbardziej psuje Twój rytm?',
    options: [
      {
        id: 'q4-mind',
        labelPl: 'Myśli wieczorem',
        weights: w({ 'night-thinker': 3 }),
      },
      {
        id: 'q4-fragments',
        labelPl: 'Częste budzenia',
        weights: w({ 'light-sleeper': 3 }),
      },
      {
        id: 'q4-early',
        labelPl: 'Zbyt wczesne pobudki',
        weights: w({ 'early-bird-flat': 3 }),
      },
      {
        id: 'q4-late',
        labelPl: 'Późne wieczory w mieście / praca',
        weights: w({ 'city-owl': 3 }),
      },
      {
        id: 'q4-weekend',
        labelPl: 'Weekendowy zjazd',
        weights: w({ 'weekend-shuttle': 3 }),
      },
      {
        id: 'q4-wired',
        labelPl: 'Kofeina lub ekran w łóżku',
        weights: w({ 'evening-wired': 3 }),
      },
    ],
  },
  {
    id: 'q5',
    iconHint: 'serce',
    titlePl: 'Co najbardziej dotyka Twojego snu ostatnio?',
    options: [
      {
        id: 'q5-thoughts',
        labelPl: 'Myśli, które nie chcą ucichnąć',
        weights: w({ 'night-thinker': 3 }),
        tieBreakBonus: { 'night-thinker': 2 },
      },
      {
        id: 'q5-fragments',
        labelPl: 'Częste budzenia w nocy',
        weights: w({ 'light-sleeper': 3 }),
        tieBreakBonus: { 'light-sleeper': 2 },
      },
      {
        id: 'q5-early',
        labelPl: 'Wczesne pobudki bez energii',
        weights: w({ 'early-bird-flat': 3 }),
        tieBreakBonus: { 'early-bird-flat': 2 },
      },
      {
        id: 'q5-schedule',
        labelPl: 'Późny rytm / zmęczenie rano',
        weights: w({ 'city-owl': 3 }),
        tieBreakBonus: { 'city-owl': 2 },
      },
      {
        id: 'q5-social',
        labelPl: 'Nieregularny rytm tygodnia i weekendu',
        weights: w({ 'weekend-shuttle': 3 }),
        tieBreakBonus: { 'weekend-shuttle': 2 },
      },
      {
        id: 'q5-stim',
        labelPl: 'Pobudzenie wieczorem (kofeina, ekran)',
        weights: w({ 'evening-wired': 3 }),
        tieBreakBonus: { 'evening-wired': 2 },
      },
      {
        id: 'q5-safety-snoring',
        labelPl: 'Głośne chrapanie / podejrzenie przerw w oddychaniu',
        weights: W(),
        safetyFlag: true,
      },
      {
        id: 'q5-safety-driving',
        labelPl: 'Zasypianie za kierownicą lub w ciągu dnia',
        weights: W(),
        safetyFlag: true,
      },
      {
        id: 'q5-safety-legs',
        labelPl: 'Silna potrzeba ruszania nogami wieczorem / w łóżku',
        weights: W(),
        safetyFlag: true,
      },
    ],
  },
];

export function getQuizOption(questionId: QuizQuestionId, optionId: string): QuizOption | undefined {
  const q = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  return q?.options.find((o) => o.id === optionId);
}

export function formatBehavioralName(id: BehavioralProfileId): string {
  return BEHAVIORAL_META[id].namePl;
}

export function detectSafetyFromAnswers(answers: import('./types').QuizAnswers): boolean {
  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = getQuizOption(question.id, optionId);
    if (option?.safetyFlag) return true;
  }
  return false;
}
import type { HabitPack, ProfileId } from './types';

const SHARED_EVENING_THINKER = [
  {
    id: 'brain-dump-step',
    titlePl: 'Zrzut głowy',
    descriptionPl: 'Odłóż myśli na jutro — dwa krótkie zdania wystarczą.',
    deepLink: 'brain-dump' as const,
  },
  {
    id: 'loose-thoughts',
    titlePl: 'Luźne myśli',
    descriptionPl: '5 min na kartce poza ekranem — bez oceniania.',
  },
  {
    id: 'dim-screen',
    titlePl: 'Ściemnij ekran',
    descriptionPl: 'Jasność minimalna — sygnał dla ciała.',
  },
];

const PACKS: Partial<Record<ProfileId, HabitPack>> = {
  'night-thinker': {
    profileId: 'night-thinker',
    suggestedTools: ['brain-dump', 'breath'],
    morning: { steps: ['mood', 'wake-time'] },
    evening: { steps: SHARED_EVENING_THINKER },
    defaultWakeTime: '07:30',
    defaultWindDownTime: '22:30',
  },
  'light-sleeper': {
    profileId: 'light-sleeper',
    suggestedTools: ['breath'],
    morning: { steps: ['mood', 'wake-time'] },
    evening: {
      steps: [
        {
          id: 'bedtime-anchor',
          titlePl: 'Stała pora zaśnięcia',
          descriptionPl: 'Potwierdź „dziś kładę się ok.” — bez perfekcji.',
        },
        {
          id: 'quiet-mode',
          titlePl: 'Cisza',
          descriptionPl: 'Włącz tryb cichego wieczoru lub łagodny dźwięk.',
        },
        {
          id: 'wake-card',
          titlePl: 'Gdy się obudzisz',
          descriptionPl: 'Krótka rutyna: światło nisko, bez scrolla, powrót do łóżka.',
        },
      ],
    },
    defaultWakeTime: '07:00',
    defaultWindDownTime: '22:00',
  },
  'city-owl': {
    profileId: 'city-owl',
    suggestedTools: ['brain-dump', 'breath'],
    morning: { steps: ['mood', 'wake-time', 'morning-light'], highlightedStep: 'morning-light' },
    evening: {
      steps: [
        {
          id: 'dim-evening',
          titlePl: 'Jasność wieczorem',
          descriptionPl: 'Stopniowo przyciemniaj światło wokół siebie.',
        },
        {
          id: 'last-scroll',
          titlePl: 'Ostatni ekran',
          descriptionPl: 'Ustal symboliczną godzinę ostatniego scrolla.',
        },
        {
          id: 'wake-confirm',
          titlePl: 'Jutrzejsza pobudka',
          descriptionPl: 'Potwierdź kotwicę — okno ±15 min jest w porządku.',
        },
      ],
    },
    defaultWakeTime: '08:30',
    defaultWindDownTime: '23:00',
  },
  'weekend-shuttle': {
    profileId: 'weekend-shuttle',
    suggestedTools: ['breath', 'brain-dump'],
    morning: { steps: ['mood', 'wake-time'] },
    evening: {
      steps: [
        {
          id: 'weekday-dark',
          titlePl: 'Jedna godzina „ciemno”',
          descriptionPl: 'W tygodniu trzymaj jedną wspólną porę wyciszenia.',
        },
        {
          id: 'short-breath',
          titlePl: 'Krótki oddech',
          descriptionPl: '2 minuty spokojnego oddechu.',
          deepLink: 'breath',
        },
      ],
      weekendVariant: [
        {
          id: 'weekend-anchor',
          titlePl: 'Kotwica weekendu',
          descriptionPl: 'Pobudka w wybranym oknie — łagodniej niż w tygodniu.',
        },
        {
          id: 'weekend-dump',
          titlePl: 'Zrzut głowy',
          descriptionPl: 'Gdy głowa pełna planów na poniedziałek.',
          deepLink: 'brain-dump',
        },
        {
          id: 'sunday-morning',
          titlePl: 'Niedzielna kotwica',
          descriptionPl: 'Krótki poranek: samopoczucie i światło.',
        },
      ],
    },
    defaultWakeTime: '08:00',
    defaultWindDownTime: '22:30',
  },
  'early-bird-flat': {
    profileId: 'early-bird-flat',
    suggestedTools: ['breath'],
    morning: { steps: ['mood', 'wake-time', 'morning-light'], highlightedStep: 'morning-light' },
    evening: {
      steps: [
        {
          id: 'afternoon-light',
          titlePl: 'Światło po południu',
          descriptionPl: '15 min jasnego światła między 12:00 a 16:00 — bez presji.',
        },
        {
          id: 'no-nap',
          titlePl: 'Bez drzemek',
          descriptionPl: 'Dziś bez krótkiej drzemki — delikatnie, bez kary.',
        },
        {
          id: 'gentle-delay',
          titlePl: 'Delikatne opóźnienie snu',
          descriptionPl: 'O 15 min później niż wczoraj — mały krok, nie skok.',
        },
      ],
    },
    defaultWakeTime: '06:30',
    defaultWindDownTime: '22:00',
  },
  'evening-wired': {
    profileId: 'evening-wired',
    suggestedTools: ['brain-dump', 'breath'],
    morning: { steps: ['mood', 'wake-time'] },
    evening: {
      steps: [
        {
          id: 'caffeine-cutoff',
          titlePl: 'Okno bez kofeiny',
          descriptionPl: 'Po 14:00 tylko woda lub bez — zaznacz gdy świadomie.',
        },
        {
          id: 'bed-no-screen',
          titlePl: 'Łóżko bez ekranu',
          descriptionPl: 'Telefon zostaje poza materacem dziś wieczorem.',
        },
        {
          id: 'wind-breath',
          titlePl: 'Oddech przed snem',
          descriptionPl: '2 min spokojnego oddechu.',
          deepLink: 'breath',
        },
      ],
    },
    defaultWakeTime: '07:30',
    defaultWindDownTime: '23:00',
  },
  'safety-path': {
    profileId: 'safety-path',
    suggestedTools: ['breath'],
    morning: { steps: ['mood'] },
    evening: {
      steps: [
        {
          id: 'safety-note',
          titlePl: 'Warto porozmawieć ze specjalistą',
          descriptionPl: 'Twoje odpowiedzi sugerują konsultację — Kotwica zostaje wspierająca, bez „ograniczania snu”.',
        },
        {
          id: 'gentle-breath',
          titlePl: 'Spokojny oddech',
          descriptionPl: 'Opcjonalnie — bez oceniania i bez zegara.',
          deepLink: 'breath',
        },
      ],
    },
    defaultWakeTime: '07:30',
    defaultWindDownTime: '22:30',
  },
};

export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 5 || day === 6;
}

export function getHabitPack(profileId: ProfileId, date: Date = new Date()): HabitPack {
  const pack = PACKS[profileId] ?? PACKS['night-thinker']!;
  if (profileId === 'weekend-shuttle' && isWeekend(date) && pack.evening.weekendVariant) {
    return {
      ...pack,
      evening: { ...pack.evening, steps: pack.evening.weekendVariant },
    };
  }
  return pack;
}

export function getBrainDumpPrompts(profileId: ProfileId): { general: string; profile: string } {
  const behavioral = profileId === 'safety-path' ? 'night-thinker' : profileId;
  switch (behavioral) {
    case 'light-sleeper':
      return {
        general: 'Co jeszcze chodzi Ci po głowie?',
        profile: 'Co mogło dziś Twoje ciało zapamiętać jako pobudzające?',
      };
    default:
      return {
        general: 'Co jeszcze chodzi Ci po głowie?',
        profile: 'Co może poczekać do jutra?',
      };
  }
}
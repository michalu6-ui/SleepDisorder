import type { ActiveProfileId, BehavioralProfileId } from './types';

export interface ProfileMeta {
  id: ActiveProfileId;
  namePl: string;
  taglinePl: string;
  onboardingRevealPl: string;
  starterHabitsPl: string[];
}

export const BEHAVIORAL_META: Record<BehavioralProfileId, ProfileMeta> = {
  'night-thinker': {
    id: 'night-thinker',
    namePl: 'Nocny myśliciel',
    taglinePl: 'Twój umysł lubi kończyć rozmowy — pomożemy je odłożyć na jutro.',
    onboardingRevealPl:
      'Wieczorem Twój umysł jeszcze pracuje. Zaczniemy od zrzutu głowy, strefy bez ekranów i spokojnego oddechu.',
    starterHabitsPl: ['Zrzut głowy wieczorem', 'Ściemnienie ekranu', '3 min oddechu'],
  },
  'light-sleeper': {
    id: 'light-sleeper',
    namePl: 'Płytki sen',
    taglinePl: 'Budujemy spokojne noce — z trybem 1 dotknięciem i bez patrzenia na zegar.',
    onboardingRevealPl:
      'Często budzisz się w nocy. Priorytetem będzie łagodny powrót do snu — bez oceniania i bez statystyk w nocy.',
    starterHabitsPl: ['Tryb ratunkowy pod ręką', 'Zasada 20 minut', 'Stała pora zaśnięcia'],
  },
  'early-bird-flat': {
    id: 'early-bird-flat',
    namePl: 'Wczesny ptak bez baterii',
    taglinePl: 'Budzisz się za wcześnie — łagodnie przesuniemy rytm, bez walki z porankiem.',
    onboardingRevealPl:
      'Rano wstajesz zanim ciało jest gotowe. Skupimy się na świetle po południu i małych krokach bez drzemek „na szybko”.',
    starterHabitsPl: ['Światło po południu', 'Bez drzemek w dzień', 'Delikatne opóźnienie snu'],
  },
  'city-owl': {
    id: 'city-owl',
    namePl: 'Sowa w trybie miasta',
    taglinePl: 'Twój rytm jest późny — kotwiczymy dzień tak, jak pozwala miasto.',
    onboardingRevealPl:
      'Energia przychodzi wieczorem. Poranna kotwica ze światłem i stopniowe przesuwanie wieczoru o 15 minut to dobry start.',
    starterHabitsPl: ['Poranne światło', 'Wieczór −15 min / tydzień', 'Stała pobudka'],
  },
  'weekend-shuttle': {
    id: 'weekend-shuttle',
    namePl: 'Weekendowy wahadłowiec',
    taglinePl: 'Tydzień i weekend to dwa światy — liczy się mała regularność, nie perfekcja.',
    onboardingRevealPl:
      'Rytm skacze między tygodniem a weekendem. Stabilizujemy pobudkę w weekendy — maksymalnie ok. 45 min później niż w tygodniu.',
    starterHabitsPl: ['Kotwica weekendu', 'Łagodne lądowanie w piątek', 'Krótka kotwica w niedzielę'],
  },
  'evening-wired': {
    id: 'evening-wired',
    namePl: 'Przebodźcowany wieczorem',
    taglinePl: 'Wieczorem ciało jest „włączone” — oddzielamy łóżko od ekranów i kofeiny.',
    onboardingRevealPl:
      'Scroll, kofeina lub praca w łóżku trzyma Cię w pobudzeniu. Zaczniemy od okna bez kofeiny i jasnej granicy łóżka.',
    starterHabitsPl: ['Okno bez kofeiny', 'Łóżko bez ekranu', 'Krótki oddech przed snem'],
  },
};

export const SAFETY_META: ProfileMeta = {
  id: 'safety-path',
  namePl: 'Ścieżka bezpieczeństwa',
  taglinePl: 'Twoje odpowiedzi wskazują, że warto porozmawieć ze specjalistą — aplikacja zostaje wspierająca, bez presji.',
  onboardingRevealPl:
    'Kotwica nie zastępuje lekarza. Poniżej spokojna wskazówka — możesz korzystać z narzędzi wyciszenia bez „ograniczania snu”.',
  starterHabitsPl: ['Spokojny oddech', 'Kontakt ze specjalistą — gdy będziesz gotowy/a', 'Tryb wspierający bez zegara'],
};

export const PROFILE_META: Record<ActiveProfileId, ProfileMeta> = {
  ...BEHAVIORAL_META,
  'safety-path': SAFETY_META,
};

export const ACTIVE_PROFILE_IDS: ActiveProfileId[] = [...Object.keys(PROFILE_META)] as ActiveProfileId[];
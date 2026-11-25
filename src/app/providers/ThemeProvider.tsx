import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppSettings, TimeOfDay } from '../../domain/types';
import { resolveTimeOfDay } from '../../domain/timeOfDay';

interface ThemeContextValue {
  timeOfDay: TimeOfDay;
  setOverride: (value: TimeOfDay | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  settings,
  rescueActive,
  onOverrideChange,
}: {
  children: ReactNode;
  settings: AppSettings;
  rescueActive?: boolean;
  onOverrideChange: (value: TimeOfDay | null) => void;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const timeOfDay = useMemo(() => {
    if (rescueActive) return 'rescue' as const;
    return resolveTimeOfDay(settings.timeOfDayOverride, new Date());
  }, [settings.timeOfDayOverride, tick, rescueActive]);

  useEffect(() => {
    document.documentElement.setAttribute('data-time-of-day', timeOfDay);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const colors: Record<TimeOfDay, string> = {
        morning: '#F4EDE4',
        day: '#F0EBE3',
        evening: '#1E2A3A',
        night: '#141820',
        rescue: '#0D1014',
      };
      meta.setAttribute('content', colors[timeOfDay]);
    }
  }, [timeOfDay]);

  const setOverride = useCallback(
    (value: TimeOfDay | null) => onOverrideChange(value),
    [onOverrideChange],
  );

  return (
    <ThemeContext.Provider value={{ timeOfDay, setOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
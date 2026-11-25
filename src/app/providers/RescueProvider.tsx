import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type RescueMode = 'idle' | 'breath' | 'audio';

interface RescueContextValue {
  active: boolean;
  mode: RescueMode;
  open: () => void;
  close: () => void;
  setMode: (mode: RescueMode) => void;
}

const RescueContext = createContext<RescueContextValue | null>(null);

export function RescueProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<RescueMode>('idle');

  const open = useCallback(() => {
    setActive(true);
    setMode('idle');
  }, []);

  const close = useCallback(() => {
    setActive(false);
    setMode('idle');
  }, []);

  useEffect(() => {
  if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  return (
    <RescueContext.Provider value={{ active, mode, open, close, setMode }}>
      {children}
    </RescueContext.Provider>
  );
}

export function useRescue() {
  const ctx = useContext(RescueContext);
  if (!ctx) throw new Error('useRescue must be used within RescueProvider');
  return ctx;
}
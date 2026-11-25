import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../../app/providers/StorageProvider';
import { playGentleTone, resumeAudio } from '../../utils/audio';
import { pulseVibrate } from '../../utils/haptics';
import { Button } from '../../components/Button';

import './calm.css';
import '../../components/Screen.css';

type Phase = 'in' | 'hold' | 'out' | 'idle';

const CYCLE_MS = { in: 4000, hold: 2000, out: 6000 };

export function BreathSession() {
  const { settings } = useStorage();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('Gotowy/a');
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    if (!running) {
      setPhase('idle');
      setLabel('Gotowy/a');
      return;
    }

    let cancelled = false;

    const runCycle = async () => {
      while (!cancelled && runningRef.current) {
        setPhase('in');
        setLabel('Wdech');
        if (settings.audio.breathSoundEnabled) {
          await resumeAudio();
          playGentleTone(settings.audio.volume * 0.5, 600);
        }
        if (settings.haptics.breathPulseEnabled) pulseVibrate([30]);
        await sleep(CYCLE_MS.in);
        if (cancelled || !runningRef.current) break;

        setPhase('hold');
        setLabel('Pauza');
        await sleep(CYCLE_MS.hold);
        if (cancelled || !runningRef.current) break;

        setPhase('out');
        setLabel('Wydech');
        if (settings.audio.breathSoundEnabled) playGentleTone(settings.audio.volume * 0.35, 800);
        await sleep(CYCLE_MS.out);
      }
    };

    void runCycle();
    return () => {
      cancelled = true;
    };
  }, [running, settings.audio.breathSoundEnabled, settings.audio.volume, settings.haptics.breathPulseEnabled]);

  const ringClass =
    phase === 'in' ? 'breath-ring breath-ring--inhale' : phase === 'out' ? 'breath-ring breath-ring--exhale' : 'breath-ring';

  return (
    <div className="screen">
      <h1 className="screen__title">Oddech</h1>
      <p className="screen__subtitle" aria-live="polite">
        {label}
      </p>
      <div className={ringClass} aria-hidden>
        <span className="breath-phase">{label}</span>
      </div>
      <Button fullWidth onClick={() => setRunning((r) => !r)}>
        {running ? 'Pauza' : 'Start'}
      </Button>
      <Link to="/calm" style={{ display: 'block', marginTop: 12, textAlign: 'center', fontSize: '0.875rem' }}>
        Wróć
      </Link>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}
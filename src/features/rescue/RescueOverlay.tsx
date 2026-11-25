import { useEffect, useRef } from 'react';
import { useRescue } from '../../app/providers/RescueProvider';
import { useStorage } from '../../app/providers/StorageProvider';
import { playRescueAmbience, resumeAudio } from '../../utils/audio';
import { BreathSession } from '../calm/BreathSession';
import { Button } from '../../components/Button';

import './rescue.css';

export function RescueOverlay() {
  const { active, mode, close, setMode } = useRescue();
  const { settings, recordRescueUse } = useStorage();
  const stopAudioRef = useRef<(() => void) | null>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    if (active && !wasActive.current) recordRescueUse();
    wasActive.current = active;
  }, [active, recordRescueUse]);

  useEffect(() => {
    if (!active || mode !== 'audio') {
      stopAudioRef.current?.();
      stopAudioRef.current = null;
      return;
    }
    void (async () => {
      await resumeAudio();
      if (settings.audio.rescueSoundEnabled) {
        stopAudioRef.current = playRescueAmbience(settings.audio.volume);
      }
    })();
    return () => {
      stopAudioRef.current?.();
      stopAudioRef.current = null;
    };
  }, [active, mode, settings.audio.rescueSoundEnabled, settings.audio.volume]);

  if (!active) return null;

  if (mode === 'breath') {
    return (
      <div className="rescue" role="dialog" aria-modal="true" aria-label="Tryb ratunkowy">
        <button type="button" className="rescue__close" onClick={() => setMode('idle')} aria-label="Wróć">
          ×
        </button>
        <BreathSession />
        <Button variant="ghost" fullWidth onClick={close}>
          Zamknij tryb ratunkowy
        </Button>
      </div>
    );
  }

  return (
    <div className="rescue" role="dialog" aria-modal="true" aria-label="Tryb ratunkowy">
      <button type="button" className="rescue__close" onClick={close} aria-label="Zamknij">
        ×
      </button>
      <p className="rescue__hint">Bez zegara. Bez statystyk. Jedno dotknięcie.</p>
      <Button
        variant="rescue"
        fullWidth
        onClick={async () => {
          await resumeAudio();
          setMode('audio');
        }}
      >
        Łagodny dźwięk
      </Button>
      <Button variant="rescue" fullWidth style={{ marginTop: 12 }} onClick={() => setMode('breath')}>
        Oddech
      </Button>
    </div>
  );
}
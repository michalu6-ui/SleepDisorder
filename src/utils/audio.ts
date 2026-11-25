let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export async function resumeAudio(): Promise<void> {
  const c = getContext();
  if (c.state === 'suspended') await c.resume();
}

export function playGentleTone(volume: number, durationMs = 800): void {
  const c = getContext();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 220;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(c.destination);
  const t = c.currentTime;
  gain.gain.linearRampToValueAtTime(volume, t + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, t + durationMs / 1000);
  osc.start(t);
  osc.stop(t + durationMs / 1000 + 0.05);
}

export function playRescueAmbience(volume: number): () => void {
  const c = getContext();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 174;
  gain.gain.value = volume * 0.4;
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  return () => {
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    osc.stop(c.currentTime + 0.35);
  };
}
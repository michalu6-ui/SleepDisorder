import { useStorage } from '../../app/providers/StorageProvider';
import { buildSevenDayView } from '../../domain/sevenDayView';

import './rhythm.css';
import '../../components/Screen.css';

const MOOD_GLYPH: Record<string, string> = {
  great: '☀',
  ok: '○',
  tired: '◐',
  rough: '☁',
};

function dayLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function RhythmScreen() {
  const { daily } = useStorage();
  const days = buildSevenDayView(daily);
  const hasAny = days.some((d) => d.morningAnchor || d.eveningAnchor || d.mood);

  return (
    <div className="screen">
      <h1 className="screen__title">Rytm</h1>
      <p className="screen__subtitle">Ostatnie 7 dni — nawyki i samopoczucie, bez „jakości snu”.</p>

      {!hasAny && (
        <div className="card">
          <p style={{ color: 'var(--color-text-muted)' }}>Jeszcze nie ma wpisów. Poranna kotwica na Dziś to dobry start.</p>
        </div>
      )}

      <ul className="rhythm-list">
        {days.map((day) => (
          <li key={day.date} className="rhythm-list__item">
            <span className="rhythm-list__date">
              {dayLabel(day.date)}
              {day.wakeTime && <span className="rhythm-list__wake">{day.wakeTime}</span>}
            </span>
            <span className="rhythm-list__mood" aria-label="Samopoczucie">
              {day.mood ? MOOD_GLYPH[day.mood] : '·'}
            </span>
            <span className="rhythm-list__dots" aria-label="Kotwice">
              <span className={day.morningAnchor ? 'dot dot--on' : 'dot'} title="Poranek" />
              <span className={day.eveningAnchor ? 'dot dot--on' : 'dot'} title="Wieczór" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
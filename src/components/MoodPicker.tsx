import type { MoodIcon } from '../domain/types';

import './MoodPicker.css';

const MOODS: { id: MoodIcon; label: string; glyph: string }[] = [
  { id: 'great', label: 'Świetnie', glyph: '☀' },
  { id: 'ok', label: 'OK', glyph: '○' },
  { id: 'tired', label: 'Zmęczony', glyph: '◐' },
  { id: 'rough', label: 'Ciężko', glyph: '☁' },
];

export function MoodPicker({
  value,
  onChange,
}: {
  value?: MoodIcon;
  onChange: (mood: MoodIcon) => void;
}) {
  return (
    <div className="mood-picker" role="radiogroup" aria-label="Samopoczucie rano">
      {MOODS.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={value === m.id}
          aria-label={m.label}
          className={`mood-picker__item ${value === m.id ? 'mood-picker__item--active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <span className="mood-picker__glyph" aria-hidden>
            {m.glyph}
          </span>
          <span className="mood-picker__label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
import './ChecklistStep.css';

export function ChecklistStep({
  title,
  description,
  done,
  onToggle,
}: {
  title: string;
  description: string;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" className={`check-step ${done ? 'check-step--done' : ''}`} onClick={onToggle}>
      <span className="check-step__box" aria-hidden>
        {done ? '✓' : ''}
      </span>
      <span className="check-step__body">
        <span className="check-step__title">{title}</span>
        <span className="check-step__desc">{description}</span>
      </span>
    </button>
  );
}
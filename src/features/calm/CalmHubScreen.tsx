import { Link } from 'react-router-dom';
import { useStorage } from '../../app/providers/StorageProvider';
import { getActiveProfileId } from '../../domain/profileResolve';
import { getHabitPack } from '../../domain/habitPacks';
import { Button } from '../../components/Button';

import '../../components/Screen.css';
import './calm.css';

export function CalmHubScreen() {
  const { profile } = useStorage();
  const pack = getHabitPack(getActiveProfileId(profile));

  return (
    <div className="screen">
      <h1 className="screen__title">Wycisz</h1>
      <p className="screen__subtitle">Narzędzia na wieczór — bez oceniania, bez pośpiechu.</p>

      <div className={`card ${pack.suggestedTools.includes('brain-dump') ? 'card--highlight' : ''}`}>
        <h2 className="card__heading">Zrzut głowy</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 12, fontSize: '0.9375rem' }}>
          Dwa pytania zamykające dzień — odłóż myśli na jutro.
        </p>
        <Link to="/calm/brain-dump">
          <Button fullWidth variant={pack.suggestedTools[0] === 'brain-dump' ? 'primary' : 'secondary'}>
            Otwórz notatnik
          </Button>
        </Link>
      </div>

      <div className={`card ${pack.suggestedTools.includes('breath') ? 'card--highlight' : ''}`}>
        <h2 className="card__heading">Ćwiczenie oddechowe</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 12, fontSize: '0.9375rem' }}>
          Pulsujący rytm wdechu i wydechu — opcjonalnie dźwięk.
        </p>
        <Link to="/calm/breath">
          <Button fullWidth variant={pack.suggestedTools[0] === 'breath' ? 'primary' : 'secondary'}>
            Zacznij oddech
          </Button>
        </Link>
      </div>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { BEHAVIORAL_META } from '../../domain/profileMeta';
import { BEHAVIORAL_PROFILE_IDS } from '../../domain/behavioralProfiles';
import { Button } from '../../components/Button';
import { useStorage } from '../../app/providers/StorageProvider';

import './why-profile.css';
import '../../components/Screen.css';

type Mode = 'onboarding' | 'from-settings';

export function WhyProfileScreen({ mode = 'onboarding' }: { mode?: Mode }) {
  const navigate = useNavigate();
  const { updateSettings } = useStorage();

  const startQuiz = () => {
    updateSettings({ hasSeenProfileExplainer: true });
    if (mode === 'onboarding') navigate('/onboarding/quiz');
    else navigate(-1);
  };

  const skip = () => {
    updateSettings({ hasSeenProfileExplainer: true });
    navigate('/onboarding/quiz');
  };

  return (
    <div className="screen why-profile">
      <h1 className="screen__title">Każdy sen ma inny rytm</h1>
      <p className="screen__subtitle">
        Nie oceniamy snu w procentach. Profil pomaga dopasować 2–3 małe kroki — do Twojego wzorca, nie do „idealnego budzika”.
      </p>

      <div className="card">
        <h2 className="card__heading">Po co profil?</h2>
        <ul className="why-profile__list">
          <li>Trudniej zasnąć → inne wieczorne kroki niż przy częstych wybudzeniach.</li>
          <li>Budzisz się w nocy → inny nacisk niż przy późnym rytmie miasta.</li>
          <li>Rytm się rozjeżdża → inna kotwica weekendu niż przy „gonitwie myśli”.</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="card__heading">Czym profil nie jest</h2>
        <p className="why-profile__muted">
          To nie diagnoza medyczna, nie etykieta choroby i nie ranking „dobrego snu”. To **wzorzec zachowania** — do testowania przyjaznych rutyn.
        </p>
      </div>

      <div className="card">
        <h2 className="card__heading">Jak to działa</h2>
        <p className="why-profile__muted">
          Krótki quiz (poniżej 30 sekund) → przyjazna nazwa profilu → możesz zmienić w zakładce Ja lub gdy rytm się przesunie (podpowiedź z ostatnich 7 dni).
        </p>
      </div>

      <section aria-label="Archetypy snu">
        <h2 className="why-profile__archetypes-title">Archetypy — bez zgadywania wyniku</h2>
        <div className="why-profile__scroll" role="list">
          {BEHAVIORAL_PROFILE_IDS.map((id) => (
            <article key={id} className="why-profile__archetype" role="listitem">
              <strong>{BEHAVIORAL_META[id].namePl}</strong>
              <p>{BEHAVIORAL_META[id].taglinePl}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="why-profile__safety">
        Jeśli quiz zauważy sygnały wymagające lekarza (np. senność za kierownicą), pokażemy spokojną ścieżkę bezpieczeństwa — bez blokowania aplikacji.
      </p>

      <div className="why-profile__cta">
        {mode === 'onboarding' ? (
          <>
            <Button fullWidth onClick={startQuiz}>
              Zacznij krótki quiz
            </Button>
            <button type="button" className="why-profile__skip" onClick={skip}>
              Pomiń wyjaśnienie
            </button>
          </>
        ) : (
          <>
            <Button fullWidth onClick={() => navigate('/me')}>
              Wróć do Ja
            </Button>
          </>
        )}
        {mode === 'from-settings' && (
          <Link to="/onboarding" className="why-profile__skip">
            Powtórz pełny quiz
          </Link>
        )}
      </div>
    </div>
  );
}
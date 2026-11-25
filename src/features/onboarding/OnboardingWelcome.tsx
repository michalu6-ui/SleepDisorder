import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useStorage } from '../../app/providers/StorageProvider';

import '../../components/Screen.css';

export function OnboardingWelcome() {
  const navigate = useNavigate();
  const { settings } = useStorage();

  return (
    <div className="onboard screen">
      <h1 className="screen__title">Kotwica</h1>
      <p className="screen__subtitle">
        Małe kroki na lepszy rytm dnia i spokojniejszy wieczór — bez oceniania snu i bez żargonu medycznego.
      </p>
      <Button
        fullWidth
        onClick={() =>
          navigate(settings.hasSeenProfileExplainer ? '/onboarding/quiz' : '/onboarding/why-profile')
        }
      >
        Zaczynamy
      </Button>
    </div>
  );
}
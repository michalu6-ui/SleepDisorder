import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../../app/providers/StorageProvider';
import { getActiveProfileId } from '../../domain/profileResolve';
import { getBrainDumpPrompts } from '../../domain/habitPacks';
import { Button } from '../../components/Button';

import './calm.css';
import '../../components/Screen.css';

export function BrainDumpModal() {
  const { profile, saveBrainDump, vaultBrainDump } = useStorage();
  const prompts = getBrainDumpPrompts(getActiveProfileId(profile));
  const [general, setGeneral] = useState('');
  const [profileAnswer, setProfileAnswer] = useState('');
  const [vaulting, setVaulting] = useState(false);
  const [done, setDone] = useState(false);

  const vault = () => {
    const entry = saveBrainDump(general, profileAnswer);
    setVaulting(true);
    window.setTimeout(() => {
      vaultBrainDump(entry.id);
      setVaulting(false);
      setDone(true);
    }, 700);
  };

  if (done) {
    return (
      <div className="screen">
        <h1 className="screen__title">Odłożone na noc</h1>
        <p className="screen__subtitle">Myśli poczekają do jutra — możesz iść dalej wyciszać ciało.</p>
        <Link to="/calm">
          <Button fullWidth>Wróć do Wycisz</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`screen brain-dump ${vaulting ? 'brain-dump--vaulting' : ''}`}>
      <h1 className="screen__title">Zrzut głowy</h1>
      <p className="screen__subtitle">Krótko — bez redagowania.</p>

      <label className="brain-dump__label">{prompts.general}</label>
      <textarea value={general} onChange={(e) => setGeneral(e.target.value)} />

      <label className="brain-dump__label">{prompts.profile}</label>
      <textarea value={profileAnswer} onChange={(e) => setProfileAnswer(e.target.value)} />

      <Button fullWidth onClick={vault} disabled={vaulting || (!general.trim() && !profileAnswer.trim())}>
        Odłóż na noc
      </Button>
      <Link to="/calm" style={{ display: 'block', marginTop: 12, textAlign: 'center', fontSize: '0.875rem' }}>
        Anuluj
      </Link>
    </div>
  );
}
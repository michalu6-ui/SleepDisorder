import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useStorage } from '../../app/providers/StorageProvider';
import { PROFILE_META, ACTIVE_PROFILE_IDS } from '../../domain/profileMeta';
import { RECALIBRATION_QUESTIONS } from '../../domain/recalibrationMatrix';
import type { ActiveProfileId, RecalibrationAnswers, TimeOfDay } from '../../domain/types';
import { getActiveProfileId } from '../../domain/profileResolve';
import { Button } from '../../components/Button';

import '../../components/Screen.css';

const TIME_OPTIONS: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];

export function SettingsScreen() {
  const navigate = useNavigate();
  const { setOverride } = useTheme();
  const {
    settings,
    profile,
    suggestion,
    updateSettings,
    setProfileManual,
    recalibrateProfile,
    acceptSuggestion,
    dismissSuggestion,
    resetAll,
    seedDemo,
  } = useStorage();
  const activeId = getActiveProfileId(profile);
  const [rcAnswers, setRcAnswers] = useState<RecalibrationAnswers>(profile.recalibrationAnswers ?? {});

  return (
    <div className="screen">
      <h1 className="screen__title">Ja</h1>
      <p className="screen__subtitle">Profil, wygląd i dane lokalne.</p>

      {suggestion && !suggestion.dismissedUntil && (
        <div className="card" style={{ borderColor: 'var(--color-accent)' }}>
          <h2 className="card__heading">Twój rytm się zmienił?</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>{suggestion.messagePl}</p>
          <Button fullWidth onClick={acceptSuggestion}>
            Zobacz profil {PROFILE_META[suggestion.suggestedProfileId].namePl}
          </Button>
          <Button variant="ghost" fullWidth style={{ marginTop: 8 }} onClick={dismissSuggestion}>
            Nie teraz
          </Button>
        </div>
      )}

      <div className="card">
        <h2 className="card__heading">Twój profil snu</h2>
        <Link to="/me/why-profile" style={{ fontSize: '0.875rem' }}>
          Po co jest profil snu?
        </Link>
        <p style={{ margin: '12px 0' }}>
          <strong>{PROFILE_META[activeId].namePl}</strong>
          {profile.safetyActive && (
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Tryb wspierający — behawioralnie: {PROFILE_META[profile.behavioralProfileId].namePl}
            </span>
          )}
        </p>
        <label className="settings-select-label">
          Profil (tryb testowy)
          <select
            value={activeId}
            onChange={(e) => setProfileManual(e.target.value as ActiveProfileId)}
            style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 12, border: '1px solid var(--color-border)' }}
          >
            {ACTIVE_PROFILE_IDS.map((id) => (
              <option key={id} value={id}>
                {PROFILE_META[id].namePl}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="ghost"
          fullWidth
          style={{ marginTop: 10 }}
          onClick={() => {
            updateSettings({ onboardingCompleted: false });
            navigate('/onboarding');
          }}
        >
          Powtórz quiz diagnozy nawyków
        </Button>
      </div>

      <div className="card">
        <h2 className="card__heading">Szybka rekalibracja</h2>
        {RECALIBRATION_QUESTIONS.map((q) => (
          <div key={q.id} style={{ marginBottom: 12 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>{q.titlePl}</p>
            <select
              value={rcAnswers[q.id] ?? ''}
              onChange={(e) => setRcAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              style={{ width: '100%', padding: 10, borderRadius: 12 }}
            >
              <option value="">—</option>
              {q.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.labelPl}
                </option>
              ))}
            </select>
          </div>
        ))}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => recalibrateProfile(rcAnswers)}
          disabled={!rcAnswers.rc1 || !rcAnswers.rc2 || !rcAnswers.rc3}
        >
          Przelicz profil
        </Button>
      </div>

      <div className="card">
        <h2 className="card__heading">Kotwice czasowe</h2>
        <label style={{ display: 'block', marginBottom: 10 }}>
          Pobudka
          <input
            type="time"
            value={settings.anchorTimes.wakeTime}
            onChange={(e) =>
              updateSettings({
                anchorTimes: { ...settings.anchorTimes, wakeTime: e.target.value },
              })
            }
            style={{ width: '100%', marginTop: 4, padding: 10 }}
          />
        </label>
        <label style={{ display: 'block' }}>
          Lądowanie
          <input
            type="time"
            value={settings.anchorTimes.windDownTime}
            onChange={(e) =>
              updateSettings({
                anchorTimes: { ...settings.anchorTimes, windDownTime: e.target.value },
              })
            }
            style={{ width: '100%', marginTop: 4, padding: 10 }}
          />
        </label>
      </div>

      <div className="card">
        <h2 className="card__heading">Wygląd</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={settings.phoneFrameEnabled}
            onChange={(e) => updateSettings({ phoneFrameEnabled: e.target.checked })}
          />
          Rama telefonu na desktopie
        </label>
        <label className="settings-select-label">
          Demo pory dnia
          <select
            value={settings.timeOfDayOverride ?? ''}
            onChange={(e) => {
              const v = e.target.value as TimeOfDay | '';
              const next = v === '' ? null : v;
              updateSettings({ timeOfDayOverride: next });
              setOverride(next);
            }}
            style={{ width: '100%', marginTop: 6, padding: 10, borderRadius: 12 }}
          >
            <option value="">Automatycznie</option>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="card">
        <h2 className="card__heading">Dźwięk i wibracje</h2>
        <label style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={settings.audio.breathSoundEnabled}
            onChange={(e) => updateSettings({ audio: { ...settings.audio, breathSoundEnabled: e.target.checked } })}
          />
          Dźwięk przy oddechu
        </label>
        <label style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={settings.audio.rescueSoundEnabled}
            onChange={(e) => updateSettings({ audio: { ...settings.audio, rescueSoundEnabled: e.target.checked } })}
          />
          Dźwięk w trybie ratunkowym
        </label>
        <label style={{ display: 'flex', gap: 8 }}>
          <input
            type="checkbox"
            checked={settings.haptics.breathPulseEnabled}
            onChange={(e) => updateSettings({ haptics: { ...settings.haptics, breathPulseEnabled: e.target.checked } })}
          />
          Wibracja przy oddechu (jeśli dostępna)
        </label>
      </div>

      <div className="card">
        <h2 className="card__heading">Granice produktu</h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
          Kotwica nie zastępuje konsultacji ze specjalistą. Przy silnej senności w dzień, problemach oddechowych w nocy lub długotrwałym lęku przed snem — warto porozmawiać z lekarzem lub psychologiem.
        </p>
      </div>

      <div className="card">
        <h2 className="card__heading">Dane</h2>
        <Button variant="secondary" fullWidth onClick={() => seedDemo()}>
          Załaduj przykładowe 7 dni
        </Button>
        <Button
          variant="ghost"
          fullWidth
          style={{ marginTop: 8 }}
          onClick={() => {
            resetAll({ keepFrame: true });
            navigate('/onboarding');
          }}
        >
          Reset danych i onboarding
        </Button>
      </div>
    </div>
  );
}
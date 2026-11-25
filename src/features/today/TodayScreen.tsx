import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRescue } from '../../app/providers/RescueProvider';
import { useStorage } from '../../app/providers/StorageProvider';
import { ChecklistStep } from '../../components/ChecklistStep';
import { MoodPicker } from '../../components/MoodPicker';
import { Button } from '../../components/Button';
import { getActiveProfileId } from '../../domain/profileResolve';
import { PROFILE_META } from '../../domain/profileMeta';
import { getHabitPack } from '../../domain/habitPacks';
import { isMorningAnchorComplete } from '../../domain/dailyChecks';
import { buildSevenDayView, todayDateString } from '../../domain/sevenDayView';
import type { DailyEntry, MoodIcon } from '../../domain/types';

import '../../components/Screen.css';
import './today.css';

function emptyToday(date: string): DailyEntry {
  return { schemaVersion: 1, date, anchorsDone: { morning: false, evening: false } };
}

export function TodayScreen() {
  const { timeOfDay } = useTheme();
  const { open: openRescue } = useRescue();
  const { profile, settings, daily, updateToday, completeMorningAnchor, toggleEveningStep } = useStorage();
  const activeId = getActiveProfileId(profile);
  const meta = PROFILE_META[activeId];
  const pack = getHabitPack(activeId);
  const date = todayDateString();
  const entry = daily[date] ?? emptyToday(date);
  const [whyOpen, setWhyOpen] = useState(false);

  const morningVisible = timeOfDay === 'morning' || timeOfDay === 'day' || !entry.anchorsDone.morning;
  const eveningVisible = timeOfDay === 'evening' || timeOfDay === 'night' || timeOfDay === 'day';

  const weekDays = buildSevenDayView(daily);
  const morningDoneCount = weekDays.filter((d) => d.morningAnchor).length;

  const patchMorning = (patch: Partial<NonNullable<DailyEntry['morning']>>) => {
    const wasDone = entry.anchorsDone.morning;
    updateToday((e) => {
      const next: DailyEntry = {
        ...e,
        morning: {
          mood: e.morning?.mood,
          wakeTimeConfirmed: e.morning?.wakeTimeConfirmed,
          morningLightDone: e.morning?.morningLightDone,
          ...patch,
        },
      };
      const complete = isMorningAnchorComplete(next, activeId);
      next.anchorsDone = { ...next.anchorsDone, morning: complete };
      if (complete) {
        next.morning = { ...next.morning, completedAt: new Date().toISOString() };
      }
      return next;
    });
    const candidate: DailyEntry = {
      ...entry,
      morning: { ...entry.morning, ...patch },
    };
    if (!wasDone && isMorningAnchorComplete(candidate, activeId)) {
      completeMorningAnchor();
    }
  };

  const setMood = (mood: MoodIcon) => {
    patchMorning({
      mood,
      wakeTimeConfirmed: entry.morning?.wakeTimeConfirmed ?? settings.anchorTimes.wakeTime,
    });
  };

  const confirmWake = () => {
    patchMorning({
      mood: entry.morning?.mood,
      wakeTimeConfirmed: settings.anchorTimes.wakeTime,
    });
  };

  const toggleSmallStep = () => {
    const next = !entry.morning?.morningLightDone;
    patchMorning({
      mood: entry.morning?.mood,
      morningLightDone: next,
      wakeTimeConfirmed: entry.morning?.wakeTimeConfirmed ?? settings.anchorTimes.wakeTime,
    });
  };

  return (
    <div className="screen">
      <h1 className="screen__title">Dziś</h1>
      <p className="screen__subtitle">{meta.taglinePl}</p>

      <section className="card">
        <h2 className="card__heading">Twój poranny start</h2>
        <p className="today-anchor__lead">
          Gdy rano dasz ciału ten sam, krótki początek dnia, wieczorem łatwiej się wyciszyć — nawet po słabszej nocy.
        </p>

        <div className="today-microstep">
          <p className="today-microstep__label">Dzisiejszy mały krok</p>
          <p className="today-microstep__hint">2 minuty przy jasnym oknie zaraz po wstaniu (okno, balkon lub jasna ściana).</p>
          <Button
            variant={entry.morning?.morningLightDone ? 'primary' : 'secondary'}
            fullWidth
            onClick={toggleSmallStep}
          >
            {entry.morning?.morningLightDone ? 'Na dziś odhaczone — dotknij, by cofnąć' : 'Odhacz na dziś'}
          </Button>
        </div>

        <div className="today-week" aria-label="Twój rytm w tym tygodniu">
          <p className="today-week__title">Twój rytm w tym tygodniu</p>
          <p className="today-week__summary">
            {morningDoneCount} z 7 ostatnich dni ze spokojnym porankiem — pominięty dzień nic nie psuje.
          </p>
          <div className="today-week__dots">
            {weekDays.map((d) => (
              <span
                key={d.date}
                className={`today-week__dot ${d.morningAnchor ? 'today-week__dot--on' : ''}`}
                title={d.date}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="today-anchor__why-toggle"
          aria-expanded={whyOpen}
          onClick={() => setWhyOpen((v) => !v)}
        >
          {whyOpen ? 'Zwiń' : 'Dlaczego to działa?'}
        </button>
        {whyOpen && (
          <p className="today-anchor__why-body">
            Stały początek dnia uczy ciała rytmu, a nie „naprawiania” jednej złej nocy. Wieczorem łatwiej zejść z obrotów,
            gdy poranek był przewidywalny. Małe kroki wystarczą — bez presji idealnego planu.
          </p>
        )}

        {morningVisible && (
          <>
            <p className="today-checkin__label">Szybki check-in</p>
            <MoodPicker value={entry.morning?.mood} onChange={setMood} />
            <div style={{ marginTop: 16 }}>
              <Button variant="secondary" fullWidth onClick={confirmWake}>
                Wstałem / wstałam ok. {settings.anchorTimes.wakeTime}
              </Button>
            </div>
          </>
        )}
      </section>

      {eveningVisible && (
        <section className="card">
          <h2 className="card__heading">Wieczorne lądowanie</h2>
          {pack.evening.steps.map((step) => (
            <ChecklistStep
              key={step.id}
              title={step.titlePl}
              description={step.descriptionPl}
              done={(entry.evening?.stepsCompleted ?? []).includes(step.id)}
              onToggle={() => toggleEveningStep(step.id)}
            />
          ))}
        </section>
      )}

      {(timeOfDay === 'night' || timeOfDay === 'evening') && (
        <Button variant="rescue" fullWidth onClick={openRescue}>
          Uspokój się
        </Button>
      )}

      <p style={{ marginTop: 16, fontSize: '0.875rem' }}>
        <Link to="/calm">Narzędzia wyciszenia →</Link>
      </p>
    </div>
  );
}
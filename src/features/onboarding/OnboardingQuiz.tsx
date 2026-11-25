import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { PROFILE_META } from '../../domain/profileMeta';
import { QUIZ_QUESTIONS } from '../../domain/quizMatrix';
import type { QuizAnswers, QuizQuestionId } from '../../domain/types';
import { isQuizComplete, resolveProfileFromQuiz } from '../../domain/ruleEngine';
import { useStorage } from '../../app/providers/StorageProvider';

import '../onboarding/onboarding.css';
import '../../components/Screen.css';

export function OnboardingQuiz() {
  const navigate = useNavigate();
  const { completeOnboarding } = useStorage();
  const [step, setStep] = useState<'quiz' | 'reveal' | 'boundaries'>('quiz');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const currentQ = QUIZ_QUESTIONS[qIndex];
  const resolved = isQuizComplete(answers) ? resolveProfileFromQuiz(answers) : null;

  const pickAnswer = (optionId: string) => {
    if (!currentQ) return;
    const id = currentQ.id as QuizQuestionId;
    const next = { ...answers, [id]: optionId };
    setAnswers(next);
    if (qIndex < QUIZ_QUESTIONS.length - 1) setQIndex((i) => i + 1);
    else setStep('reveal');
  };

  const finish = () => {
    completeOnboarding(answers);
    navigate('/today', { replace: true });
  };

  if (step === 'quiz' && currentQ) {
    return (
      <div className="onboard screen">
        <p className="onboard__progress">
          Pytanie {qIndex + 1} / {QUIZ_QUESTIONS.length}
        </p>
        <h2 className="onboard__question">{currentQ.titlePl}</h2>
        <div className="onboard__options">
          {currentQ.options.map((opt) => (
            <Button key={opt.id} variant="secondary" fullWidth onClick={() => pickAnswer(opt.id)}>
              {opt.labelPl}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'reveal' && resolved) {
    const meta = PROFILE_META[resolved.activeProfileId];
    return (
      <div className="onboard screen">
        <p className="onboard__kicker">{resolved.safetyActive ? 'Dbamy o bezpieczeństwo' : 'To brzmi jak…'}</p>
        <h2 className="screen__title">{meta.namePl}</h2>
        <p className="screen__subtitle">{meta.onboardingRevealPl}</p>
        <div className="card">
          <p className="card__heading">Na start</p>
          <ul className="onboard__starters">
            {meta.starterHabitsPl.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <Button fullWidth onClick={() => setStep('boundaries')}>
          Dalej
        </Button>
      </div>
    );
  }

  return (
    <div className="onboard screen">
      <h2 className="screen__title">Granice produktu</h2>
      <div className="card onboard__boundaries">
        <p>Kotwica nie zastępuje konsultacji ze specjalistą. Warto porozmawiać z lekarzem lub psychologiem, jeśli:</p>
        <ul>
          <li>czujesz silną senność w ciągu dnia mimo snu w nocy,</li>
          <li>partner zauważa przerwy w oddychaniu lub dławienie się we śnie,</li>
          <li>masz uczucie lęku przed snem przez długi czas,</li>
          <li>potrzebujesz leku nasennego częściej niż sporadycznie.</li>
        </ul>
      </div>
      <Button fullWidth onClick={finish}>
        Rozumiem
      </Button>
    </div>
  );
}
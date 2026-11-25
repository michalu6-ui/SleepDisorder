import type { BehavioralProfileId, QuizAnswers, QuizQuestionId, ResolvedProfile } from './types';
import { BEHAVIORAL_PRIORITY } from './behavioralProfiles';
import { detectSafetyFromAnswers, getQuizOption, QUIZ_QUESTIONS } from './quizMatrix';
import { zeroBehavioralScores } from './behavioralProfiles';

function addWeights(target: Record<BehavioralProfileId, number>, weights: Record<BehavioralProfileId, number>) {
  for (const id of BEHAVIORAL_PRIORITY) {
    target[id] += weights[id] ?? 0;
  }
}

function topScore(scores: Record<BehavioralProfileId, number>): number {
  return Math.max(...BEHAVIORAL_PRIORITY.map((id) => scores[id]));
}

function isTied(scores: Record<BehavioralProfileId, number>): boolean {
  const top = topScore(scores);
  return BEHAVIORAL_PRIORITY.filter((id) => scores[id] === top).length > 1;
}

function argMax(scores: Record<BehavioralProfileId, number>): BehavioralProfileId {
  const top = topScore(scores);
  for (const id of BEHAVIORAL_PRIORITY) {
    if (scores[id] === top) return id;
  }
  return BEHAVIORAL_PRIORITY[0];
}

export function scoreBehavioralProfile(answers: QuizAnswers): Record<BehavioralProfileId, number> {
  const scores = zeroBehavioralScores();
  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = getQuizOption(question.id, optionId);
    if (option && !option.safetyFlag) addWeights(scores, option.weights);
  }
  if (isTied(scores) && answers.q5) {
    const q5 = getQuizOption('q5', answers.q5);
    if (q5?.tieBreakBonus) {
      for (const [id, bonus] of Object.entries(q5.tieBreakBonus) as [BehavioralProfileId, number][]) {
        scores[id] += bonus;
      }
    }
  }
  return scores;
}

export function resolveProfileFromQuiz(answers: QuizAnswers): ResolvedProfile {
  const safetyActive = detectSafetyFromAnswers(answers);
  const behavioralProfileId = argMax(scoreBehavioralProfile(answers));
  const activeProfileId = safetyActive ? 'safety-path' : behavioralProfileId;
  return { behavioralProfileId, safetyActive, activeProfileId };
}

/** @deprecated użyj resolveProfileFromQuiz */
export function assignProfile(answers: QuizAnswers): BehavioralProfileId {
  return resolveProfileFromQuiz(answers).behavioralProfileId;
}

export function isQuizComplete(answers: QuizAnswers): boolean {
  const required: QuizQuestionId[] = ['q1', 'q2', 'q3', 'q4', 'q5'];
  return required.every((id) => Boolean(answers[id]));
}
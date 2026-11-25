import type { StreakState } from './types';

function parseDateOnly(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(fromDate: string, toDate: string): number {
  const from = parseDateOnly(fromDate);
  const to = parseDateOnly(toDate);
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function createInitialStreak(): StreakState {
  return {
    schemaVersion: 1,
    currentRun: 0,
    longestRun: 0,
    totalMorningAnchors: 0,
  };
}

export function updateStreakAfterMorning(streak: StreakState, date: string): StreakState {
  if (streak.lastMorningAnchorDate === date) {
    return streak;
  }

  const last = streak.lastMorningAnchorDate;
  let currentRun = 1;

  if (last) {
    const gap = daysBetween(last, date);
    if (gap === 1) currentRun = streak.currentRun + 1;
    else if (gap > 1) currentRun = 1;
    else currentRun = streak.currentRun;
  }

  const totalMorningAnchors = streak.totalMorningAnchors + 1;

  return {
    ...streak,
    currentRun,
    longestRun: Math.max(streak.longestRun, currentRun),
    lastMorningAnchorDate: date,
    totalMorningAnchors,
  };
}
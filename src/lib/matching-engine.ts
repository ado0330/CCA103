import { RoommatePreference } from "@/types";

/**
 * UniStay Roommate Matching Engine
 *
 * Weighted scoring system:
 * - Budget Match:       40%
 * - Cleanliness:        25%
 * - Sleep Schedule:     15%
 * - Study Habit:        10%
 * - Smoking Preference: 10%
 */

interface MatchBreakdown {
  budget: number;
  cleanliness: number;
  sleepSchedule: number;
  studyHabit: number;
  smoking: number;
}

export interface MatchScore {
  targetId: string;
  score: number;
  breakdown: MatchBreakdown;
}

const WEIGHTS = {
  budget: 0.4,
  cleanliness: 0.25,
  sleepSchedule: 0.15,
  studyHabit: 0.1,
  smoking: 0.1,
};

function calculateBudgetScore(a: RoommatePreference, b: RoommatePreference): number {
  // Calculate overlap between budget ranges
  const overlapStart = Math.max(a.budgetMin, b.budgetMin);
  const overlapEnd = Math.min(a.budgetMax, b.budgetMax);

  if (overlapStart > overlapEnd) {
    // No overlap — calculate how far apart they are
    const gap = overlapStart - overlapEnd;
    const avgRange = ((a.budgetMax - a.budgetMin) + (b.budgetMax - b.budgetMin)) / 2;
    return Math.max(0, 1 - gap / (avgRange || 1));
  }

  const overlap = overlapEnd - overlapStart;
  const totalRange = Math.max(a.budgetMax, b.budgetMax) - Math.min(a.budgetMin, b.budgetMin);
  return totalRange > 0 ? overlap / totalRange : 1;
}

function calculateCleanlinessScore(a: RoommatePreference, b: RoommatePreference): number {
  const diff = Math.abs(a.cleanliness - b.cleanliness);
  // Max diff is 4 (1 vs 5)
  return 1 - diff / 4;
}

function calculateSleepScore(a: RoommatePreference, b: RoommatePreference): number {
  return a.sleepSchedule === b.sleepSchedule ? 1 : 0;
}

function calculateStudyScore(a: RoommatePreference, b: RoommatePreference): number {
  return a.studyHabit === b.studyHabit ? 1 : 0;
}

function calculateSmokingScore(a: RoommatePreference, b: RoommatePreference): number {
  return a.smoking === b.smoking ? 1 : 0;
}

export function calculateCompatibility(
  requester: RoommatePreference,
  target: RoommatePreference
): MatchScore {
  const budgetRaw = calculateBudgetScore(requester, target);
  const cleanlinessRaw = calculateCleanlinessScore(requester, target);
  const sleepRaw = calculateSleepScore(requester, target);
  const studyRaw = calculateStudyScore(requester, target);
  const smokingRaw = calculateSmokingScore(requester, target);

  const breakdown: MatchBreakdown = {
    budget: Math.round(budgetRaw * WEIGHTS.budget * 100),
    cleanliness: Math.round(cleanlinessRaw * WEIGHTS.cleanliness * 100),
    sleepSchedule: Math.round(sleepRaw * WEIGHTS.sleepSchedule * 100),
    studyHabit: Math.round(studyRaw * WEIGHTS.studyHabit * 100),
    smoking: Math.round(smokingRaw * WEIGHTS.smoking * 100),
  };

  const score =
    breakdown.budget +
    breakdown.cleanliness +
    breakdown.sleepSchedule +
    breakdown.studyHabit +
    breakdown.smoking;

  return {
    targetId: target.studentId,
    score,
    breakdown,
  };
}

export function findMatches(
  requesterId: string,
  preferences: RoommatePreference[]
): MatchScore[] {
  const requesterPref = preferences.find((p) => p.studentId === requesterId);
  if (!requesterPref) return [];

  const otherPrefs = preferences.filter((p) => p.studentId !== requesterId);

  const matches = otherPrefs.map((targetPref) =>
    calculateCompatibility(requesterPref, targetPref)
  );

  // Sort descending by score
  return matches.sort((a, b) => b.score - a.score);
}

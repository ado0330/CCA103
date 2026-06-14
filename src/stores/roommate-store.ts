"use client";

import { create } from "zustand";
import { RoommatePreference, MatchResult } from "@/types";
import { mockPreferences, mockMatchResults } from "@/data/mock-data";
import { findMatches, MatchScore } from "@/lib/matching-engine";

interface RoommateStore {
  preferences: RoommatePreference[];
  matchResults: MatchResult[];

  // Actions
  setPreference: (pref: RoommatePreference) => void;
  updatePreference: (studentId: string, updates: Partial<RoommatePreference>) => void;
  generateMatches: (studentId: string) => MatchScore[];
  sendMatchRequest: (requesterId: string, targetId: string, score: number, breakdown: MatchResult["matchBreakdown"]) => void;
  acceptMatch: (matchId: string) => void;
  rejectMatch: (matchId: string) => void;

  // Getters
  getPreferenceByStudent: (studentId: string) => RoommatePreference | undefined;
  getMatchesByStudent: (studentId: string) => MatchResult[];
  getIncomingRequests: (studentId: string) => MatchResult[];
}

export const useRoommateStore = create<RoommateStore>((set, get) => ({
  preferences: mockPreferences,
  matchResults: mockMatchResults,

  setPreference: (pref) => {
    set((state) => {
      const exists = state.preferences.find((p) => p.studentId === pref.studentId);
      if (exists) {
        return {
          preferences: state.preferences.map((p) =>
            p.studentId === pref.studentId ? pref : p
          ),
        };
      }
      return { preferences: [...state.preferences, pref] };
    });
  },

  updatePreference: (studentId, updates) => {
    set((state) => ({
      preferences: state.preferences.map((p) =>
        p.studentId === studentId ? { ...p, ...updates } : p
      ),
    }));
  },

  generateMatches: (studentId) => {
    return findMatches(studentId, get().preferences);
  },

  sendMatchRequest: (requesterId, targetId, score, breakdown) => {
    const newMatch: MatchResult = {
      id: `m${Date.now()}`,
      requesterId,
      targetId,
      compatibilityScore: score,
      status: "pending",
      matchBreakdown: breakdown,
    };
    set((state) => ({
      matchResults: [...state.matchResults, newMatch],
    }));
  },

  acceptMatch: (matchId) => {
    set((state) => ({
      matchResults: state.matchResults.map((m) =>
        m.id === matchId ? { ...m, status: "accepted" as const } : m
      ),
    }));
  },

  rejectMatch: (matchId) => {
    set((state) => ({
      matchResults: state.matchResults.map((m) =>
        m.id === matchId ? { ...m, status: "rejected" as const } : m
      ),
    }));
  },

  getPreferenceByStudent: (studentId) => {
    return get().preferences.find((p) => p.studentId === studentId);
  },

  getMatchesByStudent: (studentId) => {
    return get().matchResults.filter(
      (m) => m.requesterId === studentId || m.targetId === studentId
    );
  },

  getIncomingRequests: (studentId) => {
    return get().matchResults.filter(
      (m) => m.targetId === studentId && m.status === "pending"
    );
  },
}));

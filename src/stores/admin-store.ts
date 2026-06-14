"use client";

import { create } from "zustand";
import { ScamReport } from "@/types";
import { mockReports } from "@/data/mock-data";

interface AdminStore {
  reports: ScamReport[];

  // Report Actions
  addReport: (report: Omit<ScamReport, "id" | "createdAt" | "status">) => void;
  updateReportStatus: (id: string, status: ScamReport["status"]) => void;
  resolveReport: (id: string) => void;

  // Getters
  getReportById: (id: string) => ScamReport | undefined;
  getOpenReports: () => ScamReport[];
  getReportsByTarget: (targetUserId: string) => ScamReport[];
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  reports: mockReports,

  addReport: (report) => {
    const newReport: ScamReport = {
      ...report,
      id: `r${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      reports: [...state.reports, newReport],
    }));
  },

  updateReportStatus: (id, status) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
  },

  resolveReport: (id) => {
    get().updateReportStatus(id, "resolved");
  },

  getReportById: (id) => {
    return get().reports.find((r) => r.id === id);
  },

  getOpenReports: () => {
    return get().reports.filter((r) => r.status !== "resolved");
  },

  getReportsByTarget: (targetUserId) => {
    return get().reports.filter((r) => r.targetUserId === targetUserId);
  },
}));

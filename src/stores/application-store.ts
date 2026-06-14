"use client";

import { create } from "zustand";
import { TenancyApplication, Lease } from "@/types";
import { mockApplications, mockLeases } from "@/data/mock-data";

interface ApplicationStore {
  applications: TenancyApplication[];
  leases: Lease[];

  // Actions
  submitApplication: (app: Omit<TenancyApplication, "id" | "createdAt" | "status">) => void;
  approveApplication: (id: string, monthlyRent: number) => void;
  rejectApplication: (id: string) => void;

  // Getters
  getApplicationById: (id: string) => TenancyApplication | undefined;
  getApplicationsByApplicant: (applicantId: string) => TenancyApplication[];
  getApplicationsByProperty: (propertyId: string) => TenancyApplication[];
  getLeaseByApplication: (applicationId: string) => Lease | undefined;
  getLeasesByTenant: (tenantId: string) => Lease[];
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: mockApplications,
  leases: mockLeases,

  submitApplication: (app) => {
    const newApp: TenancyApplication = {
      ...app,
      id: `app${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      applications: [...state.applications, newApp],
    }));
  },

  approveApplication: (id, monthlyRent) => {
    const app = get().getApplicationById(id);
    if (!app) return;

    // Update application status
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status: "approved" as const } : a
      ),
    }));

    // Generate lease
    const newLease: Lease = {
      id: `lease${Date.now()}`,
      applicationId: id,
      propertyId: app.propertyId,
      tenantIds: [app.applicantId, ...app.roommateIds],
      leaseStart: new Date().toISOString().split("T")[0],
      leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      monthlyRent,
      signed: false,
    };
    set((state) => ({
      leases: [...state.leases, newLease],
    }));
  },

  rejectApplication: (id) => {
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status: "rejected" as const } : a
      ),
    }));
  },

  getApplicationById: (id) => {
    return get().applications.find((a) => a.id === id);
  },

  getApplicationsByApplicant: (applicantId) => {
    return get().applications.filter((a) => a.applicantId === applicantId);
  },

  getApplicationsByProperty: (propertyId) => {
    return get().applications.filter((a) => a.propertyId === propertyId);
  },

  getLeaseByApplication: (applicationId) => {
    return get().leases.find((l) => l.applicationId === applicationId);
  },

  getLeasesByTenant: (tenantId) => {
    return get().leases.filter((l) => l.tenantIds.includes(tenantId));
  },
}));

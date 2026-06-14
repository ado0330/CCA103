// ============================================
// UniStay - Type Definitions
// ============================================

export interface User {
  id: string;
  role: "student" | "landlord" | "admin";
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  status: "active" | "suspended";
  university?: string;
  phone?: string;
}

export interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  address: string;
  monthlyRent: number;
  images: string[];
  amenities: string[];
  availableRooms: number;
  totalRooms: number;
  status: "pending" | "approved" | "rejected";
  propertyType: "apartment" | "house" | "room" | "studio";
  distanceToUSM: string;
  createdAt: string;
}

export interface RoommatePreference {
  id: string;
  studentId: string;
  budgetMin: number;
  budgetMax: number;
  cleanliness: number; // 1-5
  sleepSchedule: "early" | "late";
  studyHabit: "quiet" | "social";
  smoking: boolean;
  gender?: "male" | "female" | "any";
  bio?: string;
}

export interface MatchResult {
  id: string;
  requesterId: string;
  targetId: string;
  compatibilityScore: number;
  status: "pending" | "accepted" | "rejected";
  matchBreakdown?: {
    budget: number;
    cleanliness: number;
    sleepSchedule: number;
    studyHabit: number;
    smoking: number;
  };
}

export interface TenancyApplication {
  id: string;
  propertyId: string;
  applicantId: string;
  roommateIds: string[];
  documents: string[];
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: string;
}

export interface Lease {
  id: string;
  applicationId: string;
  propertyId: string;
  tenantIds: string[];
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  signed: boolean;
}

export interface ScamReport {
  id: string;
  reporterId: string;
  targetUserId: string;
  reason: string;
  description?: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
}

export type UserRole = "student" | "landlord" | "admin";

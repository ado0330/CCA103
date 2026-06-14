"use client";

import { useUserStore } from "@/stores/user-store";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { LandlordDashboard } from "@/components/dashboard/landlord-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
  const { currentRole } = useUserStore();

  return (
    <>
      {currentRole === "student" && <StudentDashboard />}
      {currentRole === "landlord" && <LandlordDashboard />}
      {currentRole === "admin" && <AdminDashboard />}
    </>
  );
}

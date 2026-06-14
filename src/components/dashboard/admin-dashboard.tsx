"use client";

import { StatsCard } from "./stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePropertyStore } from "@/stores/property-store";
import { useUserStore } from "@/stores/user-store";
import { useAdminStore } from "@/stores/admin-store";
import {
  ShieldCheck,
  AlertTriangle,
  UserX,
  Building,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  const { users } = useUserStore();
  
  usePropertyStore((s) => s.properties);
  const getPendingProperties = usePropertyStore((s) => s.getPendingProperties);
  const pendingProperties = getPendingProperties();

  useAdminStore((s) => s.reports);
  const getOpenReports = useAdminStore((s) => s.getOpenReports);
  const openReports = getOpenReports();

  const unverifiedLandlords = users.filter(
    (u) => u.role === "landlord" && !u.verified
  );
  const suspendedUsers = users.filter((u) => u.status === "suspended");

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and pending actions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Verifications"
          value={unverifiedLandlords.length}
          description="Landlords awaiting verification"
          icon={<ShieldCheck className="h-6 w-6" />}
          trend={
            unverifiedLandlords.length > 0
              ? { value: "Action needed", positive: false }
              : undefined
          }
        />
        <StatsCard
          title="Property Approvals"
          value={pendingProperties.length}
          description="Properties in review"
          icon={<Building className="h-6 w-6" />}
        />
        <StatsCard
          title="Open Reports"
          value={openReports.length}
          description="Requires investigation"
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={
            openReports.length > 0
              ? { value: `${openReports.length} active`, positive: false }
              : undefined
          }
        />
        <StatsCard
          title="Suspended Users"
          value={suspendedUsers.length}
          description="Currently restricted"
          icon={<UserX className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Property Approvals */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Property Approval Queue
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingProperties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProperties.map((property) => {
                  const landlord = users.find(
                    (u) => u.id === property.landlordId
                  );
                  return (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{property.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by {landlord?.name || "Unknown"} • RM{" "}
                          {property.monthlyRent}/mo
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-200 bg-amber-50"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Reports
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No open reports</p>
              </div>
            ) : (
              <div className="space-y-3">
                {openReports.map((report) => {
                  const reporter = users.find((u) => u.id === report.reporterId);
                  const target = users.find((u) => u.id === report.targetUserId);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{report.reason}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {reporter?.name} → {target?.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          report.status === "open"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

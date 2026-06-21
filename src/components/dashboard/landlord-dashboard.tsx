"use client";

import { StatsCard } from "./stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/stores/application-store";
import { usePropertyStore } from "@/stores/property-store";
import { useUserStore } from "@/stores/user-store";
import {
  Home,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function LandlordDashboard() {
  const { currentUser } = useUserStore();
  usePropertyStore((s) => s.properties);
  const getPropertiesByLandlord = usePropertyStore((s) => s.getPropertiesByLandlord);
  const myProperties = getPropertiesByLandlord(currentUser.id);
  const allApplications = useApplicationStore((s) => s.applications);

  const myPropertyIds = myProperties.map((p) => p.id);
  const myApplications = allApplications.filter((a) =>
    myPropertyIds.includes(a.propertyId)
  );
  const pendingApps = myApplications.filter((a) => a.status === "pending");

  const totalRooms = myProperties.reduce((sum, p) => sum + p.totalRooms, 0);
  const occupiedRooms = myProperties.reduce(
    (sum, p) => sum + (p.totalRooms - p.availableRooms),
    0
  );
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Landlord Dashboard 🏠
          </h1>
          <p className="text-muted-foreground mt-1.5 text-[15px]">
            Manage your properties and tenant applications.
          </p>
        </div>
        <Link href="/landlord/properties">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard
          title="Total Properties"
          value={myProperties.length}
          description={`${myProperties.filter((p) => p.status === "approved").length} approved`}
          icon={<Home className="h-6 w-6" />}
        />
        <StatsCard
          title="Pending Applications"
          value={pendingApps.length}
          description="Awaiting your review"
          icon={<FileText className="h-6 w-6" />}
          trend={
            pendingApps.length > 0
              ? { value: `${pendingApps.length} new`, positive: true }
              : undefined
          }
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          description={`${occupiedRooms} of ${totalRooms} rooms`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Applications
              <Link href="/landlord">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No pending applications</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingApps.slice(0, 3).map((app) => {
                  const property = myProperties.find((p) => p.id === app.propertyId);
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {property?.title || "Unknown Property"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-200 bg-amber-50"
                      >
                        Pending
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Your Properties
              <Link href="/landlord/properties">
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {myProperties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-accent/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {property.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {property.availableRooms} of {property.totalRooms} rooms available
                    </p>
                  </div>
                  <Badge
                    variant={
                      property.status === "approved"
                        ? "default"
                        : property.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs capitalize"
                  >
                    {property.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

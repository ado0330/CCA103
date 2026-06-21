"use client";

import { StatsCard } from "./stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/stores/application-store";
import { usePropertyStore } from "@/stores/property-store";
import { useRoommateStore } from "@/stores/roommate-store";
import { useUserStore } from "@/stores/user-store";
import {
  FileText,
  Heart,
  Building,
  ArrowRight,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function StudentDashboard() {
  const { currentUser } = useUserStore();
  useApplicationStore((s) => s.applications);
  const getApplicationsByApplicant = useApplicationStore((s) => s.getApplicationsByApplicant);
  const applications = getApplicationsByApplicant(currentUser.id);

  usePropertyStore((s) => s.properties);
  const getApprovedProperties = usePropertyStore((s) => s.getApprovedProperties);
  const properties = getApprovedProperties();

  useRoommateStore((s) => s.matchResults);
  const getIncomingRequests = useRoommateStore((s) => s.getIncomingRequests);
  const incomingRequests = getIncomingRequests(currentUser.id);

  const activeApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Welcome back, {currentUser.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1.5 text-[15px]">
          Here&apos;s what&apos;s happening with your housing search.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard
          title="Active Applications"
          value={activeApps}
          description={`${approvedApps} approved`}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatsCard
          title="Roommate Requests"
          value={incomingRequests.length}
          description="Pending matches"
          icon={<Heart className="h-6 w-6" />}
        />
        <StatsCard
          title="Available Properties"
          value={properties.length}
          description="Near USM"
          icon={<Building className="h-6 w-6" />}
          trend={{ value: "3 new", positive: true }}
        />
      </div>

      {/* Quick Actions & Featured Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link href="/properties">
              <Button variant="outline" className="w-full justify-between h-12 group">
                <span className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </span>
                  Browse Properties
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/roommate">
              <Button variant="outline" className="w-full justify-between h-12 group">
                <span className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-pink-500" />
                  </span>
                  Find Roommates
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/applications">
              <Button variant="outline" className="w-full justify-between h-12 group">
                <span className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-amber-500" />
                  </span>
                  View Applications
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Featured Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Featured Properties
              <Link href="/properties">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {properties.slice(0, 3).map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
              >
                <div className="relative h-14 w-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{property.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.distanceToUSM}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      <DollarSign className="h-3 w-3" />
                      RM {property.monthlyRent}/mo
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

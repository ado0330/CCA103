"use client";

import { useUserStore } from "@/stores/user-store";
import { useApplicationStore } from "@/stores/application-store";
import { usePropertyStore } from "@/stores/property-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

export default function ApplicationsPage() {
  const { currentUser } = useUserStore();
  const { getApplicationsByApplicant, getLeaseByApplication } =
    useApplicationStore();
  const { getPropertyById } = usePropertyStore();

  const applications = getApplicationsByApplicant(currentUser.id);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          My Applications 📋
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your rental applications and leases.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Browse properties and submit your first application.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const property = getPropertyById(app.propertyId);
            const lease = getLeaseByApplication(app.id);
            const status = statusConfig[app.status];

            return (
              <Card
                key={app.id}
                className="border-border/50 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {property?.title || "Unknown Property"}
                      </h3>
                      {property && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {property.address}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("gap-1 font-medium", status.color)}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>

                  {app.message && (
                    <div className="mt-3 p-3 rounded-lg bg-accent/30 text-sm text-muted-foreground">
                      &ldquo;{app.message}&rdquo;
                    </div>
                  )}

                  {/* Documents */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {app.documents.map((doc) => (
                      <Badge
                        key={doc}
                        variant="secondary"
                        className="gap-1 text-xs"
                      >
                        <FileText className="h-3 w-3" />
                        {doc}
                      </Badge>
                    ))}
                  </div>

                  {/* Lease Info */}
                  {lease && (
                    <>
                      <Separator className="my-4" />
                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <h4 className="font-semibold text-emerald-800">
                            Lease Agreement
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-emerald-600">Start Date</p>
                            <p className="font-medium">{lease.leaseStart}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600">End Date</p>
                            <p className="font-medium">{lease.leaseEnd}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600">Monthly Rent</p>
                            <p className="font-medium flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              RM {lease.monthlyRent}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                          onClick={() => {
                            // Mock download
                            alert("Mock: Downloading lease agreement...");
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Lease
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

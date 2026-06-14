"use client";

import { useUserStore } from "@/stores/user-store";
import { useApplicationStore } from "@/stores/application-store";
import { usePropertyStore } from "@/stores/property-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LandlordApplicationsPage() {
  const { currentUser, getUserById } = useUserStore();
  const { applications, approveApplication, rejectApplication } =
    useApplicationStore();
  const { getPropertyById, getPropertiesByLandlord } = usePropertyStore();

  const myProperties = getPropertiesByLandlord(currentUser.id);
  const myPropertyIds = myProperties.map((p) => p.id);
  const myApplications = applications.filter((a) =>
    myPropertyIds.includes(a.propertyId)
  );

  const pending = myApplications.filter((a) => a.status === "pending");
  const processed = myApplications.filter((a) => a.status !== "pending");

  const handleApprove = (appId: string, propertyId: string) => {
    const property = getPropertyById(propertyId);
    if (property) {
      approveApplication(appId, property.monthlyRent);
      toast.success("Application approved!", {
        description: "A lease has been generated for the tenant.",
      });
    }
  };

  const handleReject = (appId: string) => {
    rejectApplication(appId);
    toast.info("Application rejected.");
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Tenant Applications 📨
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage incoming rental applications.
        </p>
      </div>

      {/* Pending Applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No pending applications
              </p>
            </CardContent>
          </Card>
        ) : (
          pending.map((app) => {
            const property = getPropertyById(app.propertyId);
            const applicant = getUserById(app.applicantId);

            return (
              <Card key={app.id} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={applicant?.avatar} />
                        <AvatarFallback>
                          {applicant?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {applicant?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {property?.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        {app.message && (
                          <p className="text-sm text-muted-foreground mt-2 p-2 rounded bg-accent/30">
                            &ldquo;{app.message}&rdquo;
                          </p>
                        )}
                        <div className="flex gap-1.5 mt-2">
                          {app.documents.map((doc) => (
                            <Badge key={doc} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => handleApprove(app.id, app.propertyId)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        onClick={() => handleReject(app.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Processed Applications */}
      {processed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Processed ({processed.length})
          </h2>
          {processed.map((app) => {
            const property = getPropertyById(app.propertyId);
            const applicant = getUserById(app.applicantId);

            return (
              <Card key={app.id} className="border-border/50 opacity-75">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={applicant?.avatar} />
                      <AvatarFallback>
                        {applicant?.name?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{applicant?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {property?.title}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved" ? "default" : "destructive"
                    }
                  >
                    {app.status === "approved" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {app.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

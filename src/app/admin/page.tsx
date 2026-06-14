"use client";

import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { useAdminStore } from "@/stores/admin-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search as SearchIcon,
  Eye,
  UserX,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminPage() {
  const { users, verifyUser, suspendUser, reactivateUser, getUserById } =
    useUserStore();
  const {
    properties,
    approveProperty,
    rejectProperty,
    getPendingProperties,
  } = usePropertyStore();
  const { reports, updateReportStatus, resolveReport } = useAdminStore();

  const unverifiedLandlords = users.filter(
    (u) => u.role === "landlord" && !u.verified
  );
  const pendingProperties = getPendingProperties();
  const openReports = reports.filter((r) => r.status !== "resolved");

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Admin Panel 🛡️
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage verifications, approvals, and reports.
        </p>
      </div>

      <Tabs defaultValue="landlords" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="landlords" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Landlords
            {unverifiedLandlords.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {unverifiedLandlords.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="properties" className="gap-2">
            <Building className="h-4 w-4" />
            Properties
            {pendingProperties.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {pendingProperties.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reports
            {openReports.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {openReports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Landlord Verification */}
        <TabsContent value="landlords" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Landlord Verification Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {unverifiedLandlords.length === 0 ? (
                <div className="text-center py-10">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    All landlords are verified
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unverifiedLandlords.map((landlord) => (
                    <div
                      key={landlord.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-accent/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={landlord.avatar} />
                          <AvatarFallback>
                            {landlord.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{landlord.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {landlord.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            verifyUser(landlord.id);
                            toast.success(`${landlord.name} verified!`);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => {
                            suspendUser(landlord.id);
                            toast.info(`${landlord.name} suspended.`);
                          }}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Landlords Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">All Landlords</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter((u) => u.role === "landlord")
                    .map((landlord) => (
                      <TableRow key={landlord.id}>
                        <TableCell className="font-medium">
                          {landlord.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {landlord.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              landlord.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {landlord.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {landlord.verified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {landlord.status === "active" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                suspendUser(landlord.id);
                                toast.info(`${landlord.name} suspended.`);
                              }}
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                reactivateUser(landlord.id);
                                toast.success(`${landlord.name} reactivated.`);
                              }}
                            >
                              Reactivate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Approvals */}
        <TabsContent value="properties" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Property Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProperties.length === 0 ? (
                <div className="text-center py-10">
                  <Building className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No pending properties
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map((property) => {
                    const landlord = getUserById(property.landlordId);
                    return (
                      <Card
                        key={property.id}
                        className="overflow-hidden border-border/50"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-32 sm:h-auto sm:w-48 flex-shrink-0">
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {property.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {property.address}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  by {landlord?.name} • RM{" "}
                                  {property.monthlyRent}/mo
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {property.description}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                onClick={() => {
                                  approveProperty(property.id);
                                  toast.success(`${property.title} approved!`);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                onClick={() => {
                                  rejectProperty(property.id);
                                  toast.info(`${property.title} rejected.`);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Scam Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-10">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No reports filed
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => {
                      const reporter = getUserById(report.reporterId);
                      const target = getUserById(report.targetUserId);
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium text-sm">
                            {reporter?.name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {target?.name}
                          </TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">
                            {report.reason}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === "resolved"
                                  ? "default"
                                  : report.status === "investigating"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs capitalize"
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {report.status !== "resolved" && (
                              <div className="flex gap-1 justify-end">
                                {report.status === "open" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      updateReportStatus(
                                        report.id,
                                        "investigating"
                                      );
                                      toast.info("Report marked as investigating.");
                                    }}
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                    Investigate
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    resolveReport(report.id);
                                    toast.success("Report resolved.");
                                  }}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

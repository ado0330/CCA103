"use client";

import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { users, suspendUser, reactivateUser, verifyUser } = useUserStore();

  const students = users.filter((u) => u.role === "student");
  const landlords = users.filter((u) => u.role === "landlord");

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          User Management 👥
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all platform users.
        </p>
      </div>

      {/* Students */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm">{user.university}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "active" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive text-xs"
                        onClick={() => {
                          suspendUser(user.id);
                          toast.info(`${user.name} suspended.`);
                        }}
                      >
                        <UserX className="h-3.5 w-3.5 mr-1" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => {
                          reactivateUser(user.id);
                          toast.success(`${user.name} reactivated.`);
                        }}
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" />
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

      {/* Landlords */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            Landlords ({landlords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landlords.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.verified ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => {
                          verifyUser(user.id);
                          toast.success(`${user.name} verified!`);
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        Verify
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "active" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive text-xs"
                        onClick={() => {
                          suspendUser(user.id);
                          toast.info(`${user.name} suspended.`);
                        }}
                      >
                        <UserX className="h-3.5 w-3.5 mr-1" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => {
                          reactivateUser(user.id);
                          toast.success(`${user.name} reactivated.`);
                        }}
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" />
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
    </div>
  );
}

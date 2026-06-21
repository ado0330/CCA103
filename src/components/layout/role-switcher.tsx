"use client";

import { useUserStore } from "@/stores/user-store";
import { UserRole } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, GraduationCap, Building2 } from "lucide-react";

const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; color: string; ring: string }> = {
  student: {
    label: "Student",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "text-primary",
    ring: "ring-primary/20",
  },
  landlord: {
    label: "Landlord",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-emerald-600",
    ring: "ring-emerald-500/20",
  },
  admin: {
    label: "Admin",
    icon: <Shield className="h-4 w-4" />,
    color: "text-primary",
    ring: "ring-primary/20",
  },
};

export function RoleSwitcher() {
  const { currentUser, currentRole, setCurrentRole } = useUserStore();
  const config = roleConfig[currentRole];

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-accent/40">
      <Avatar className={`h-9 w-9 ring-2 ${config.ring} flex-shrink-0`}>
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {currentUser.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 lg:opacity-100 transition-opacity duration-200">
        <p className="text-sm font-semibold truncate">{currentUser.name}</p>
        <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as UserRole)}>
          <SelectTrigger
            id="role-switcher"
            className="h-5 border-0 p-0 shadow-none text-xs font-medium bg-transparent focus:ring-0"
          >
            <span className={`flex items-center gap-1.5 ${config.color}`}>
              {config.icon}
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Student
              </span>
            </SelectItem>
            <SelectItem value="landlord">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Landlord
              </span>
            </SelectItem>
            <SelectItem value="admin">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Admin
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

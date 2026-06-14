"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { RoleSwitcher } from "./role-switcher";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  ShieldCheck,
  Home,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ("student" | "landlord" | "admin")[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["student", "landlord", "admin"],
  },
  {
    label: "Properties",
    href: "/properties",
    icon: <Building className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "Roommate Match",
    href: "/roommate",
    icon: <Heart className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "My Applications",
    href: "/applications",
    icon: <FileText className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "My Properties",
    href: "/landlord/properties",
    icon: <Home className="h-5 w-5" />,
    roles: ["landlord"],
  },
  {
    label: "Applications",
    href: "/landlord",
    icon: <FileText className="h-5 w-5" />,
    roles: ["landlord"],
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: <ShieldCheck className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole } = useUserStore();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              UniStay
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
              Smart Housing
            </p>
          </div>
        </Link>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="p-4 border-t border-border/50">
        <RoleSwitcher />
      </div>
    </aside>
  );
}

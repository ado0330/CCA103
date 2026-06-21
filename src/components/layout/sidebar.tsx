"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { RoleSwitcher } from "./role-switcher";
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  ShieldCheck,
  Home,
  Heart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <aside className="hidden lg:flex flex-col w-[72px] hover:w-60 bg-white h-screen sticky top-0 transition-all duration-300 ease-in-out group/sidebar overflow-hidden shadow-card z-30">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 h-16 flex-shrink-0">
        <div className="h-10 w-10 min-w-[40px] bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Home className="h-5 w-5" />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            UniStay
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && item.href !== "/landlord" && item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                    )}
                  />
                }
              >
                <span className="min-w-[20px] flex justify-center">{item.icon}</span>
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:group-hover/sidebar:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="px-3 py-3 border-t border-border/50 flex-shrink-0">
        <RoleSwitcher />
      </div>
    </aside>
  );
}

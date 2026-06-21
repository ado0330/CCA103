"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import {
  LayoutDashboard,
  Building,
  Heart,
  FileText,
  Home,
  ShieldCheck,
  Users,
  Menu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "./role-switcher";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ("student" | "landlord" | "admin")[];
}

const bottomNavItems: NavItem[] = [
  {
    label: "Home",
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
    label: "Match",
    href: "/roommate",
    icon: <Heart className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "Apply",
    href: "/applications",
    icon: <FileText className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "Properties",
    href: "/landlord/properties",
    icon: <Home className="h-5 w-5" />,
    roles: ["landlord"],
  },
  {
    label: "Requests",
    href: "/landlord",
    icon: <FileText className="h-5 w-5" />,
    roles: ["landlord"],
  },
  {
    label: "Admin",
    href: "/admin",
    icon: <ShieldCheck className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { currentRole } = useUserStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredItems = bottomNavItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/80 backdrop-blur-xl shadow-card">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">UniStay</span>
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0 rounded-l-2xl">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-5">
              <RoleSwitcher />
            </div>
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <nav className="p-4 space-y-1">
              {filteredItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && item.href !== "/landlord" && item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl shadow-nav">
        <div className="flex items-center justify-around h-[68px] px-2 pb-1">
          {filteredItems.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && item.href !== "/landlord" && item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 text-xs font-semibold min-w-[60px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-primary/10 scale-110"
                  )}
                >
                  {item.icon}
                </span>
                <span className={cn(
                  "transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

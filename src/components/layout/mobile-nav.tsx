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
import { Separator } from "@/components/ui/separator";
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
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            UniStay
          </span>
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-4">
              <RoleSwitcher />
            </div>
            <Separator />
            <nav className="p-4 space-y-1">
              {filteredItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <div className="flex items-center justify-around h-16 px-2">
          {filteredItems.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "p-1 rounded-lg transition-all",
                    isActive && "bg-primary/10"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

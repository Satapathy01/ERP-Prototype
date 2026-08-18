"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  IndianRupee,
  CalendarDays,
  Library,
  Bus,
  Building2,
  UserCog,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Academics",
    items: [
      {
        title: "Students",
        href: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        title: "Teachers",
        href: "/dashboard/teachers",
        icon: Users,
      },
      {
        title: "Classes",
        href: "/dashboard/classes",
        icon: BookOpen,
      },
      {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: ClipboardCheck,
      },
      {
        title: "Finance",
        href: "/dashboard/finance",
        icon: IndianRupee,
      },
      {
        title: "Examinations",
        href: "/dashboard/exams",
        icon: CalendarDays,
      },
    ],
  },

  {
    title: "Services",
    items: [
      {
        title: "Library",
        href: "/dashboard/library",
        icon: Library,
      },
      {
        title: "Transport",
        href: "/dashboard/transport",
        icon: Bus,
      },
      {
        title: "Hostel",
        href: "/dashboard/hostel",
        icon: Building2,
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: UserCog,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 border-r bg-background lg:flex lg:flex-col">
      {/* Logo */}

      <div className="flex h-16 items-center border-b px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          ERP
        </div>

        <div className="ml-3">
          <h2 className="font-semibold">
            School ERP
          </h2>

          <p className="text-xs text-muted-foreground">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navigation.map((group) => (
          <div
            key={group.title}
            className="mb-8"
          >
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />

                      {item.title}
                    </div>

                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";

import {
  UserPlus,
  ClipboardCheck,
  IndianRupee,
  Bell,
  BookOpen,
  CalendarPlus,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Action {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const actions: Action[] = [
  {
    title: "Add Student",
    description: "Register a new student",
    href: "/dashboard/people/students",
    icon: UserPlus,
  },
  {
    title: "Attendance",
    description: "Mark today's attendance",
    href: "/dashboard/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Collect Fees",
    description: "Record fee payment",
    href: "/finance/payments/new",
    icon: IndianRupee,
  },
  {
    title: "Create Notice",
    description: "Post an announcement",
    href: "/dashboard/notices/new",
    icon: Bell,
  },
  {
    title: "Manage Classes",
    description: "Class & section management",
    href: "/dashboard/classes",
    icon: BookOpen,
  },
  {
    title: "Schedule Exam",
    description: "Create exam timetable",
    href: "/dashboard/exams/new",
    icon: CalendarPlus,
  },
];

export default function QuickActions() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>

        <CardDescription>
          Frequently used shortcuts
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
              >
                <Button
                  variant="outline"
                  className="h-auto w-full justify-between rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="text-left">
                      <p className="font-semibold">
                        {action.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import {
  Bell,
  CalendarDays,
  Megaphone,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "Announcement" | "Exam" | "Holiday";
}

const notices: Notice[] = [
  {
    id: 1,
    title: "Mid-Term Examination",
    description: "Examinations will begin from 21st July.",
    date: "Today",
    type: "Exam",
  },
  {
    id: 2,
    title: "Independence Day Celebration",
    description: "Flag hoisting ceremony at 8:00 AM.",
    date: "15 Aug",
    type: "Announcement",
  },
  {
    id: 3,
    title: "School Holiday",
    description: "School will remain closed on Rath Yatra.",
    date: "27 Jun",
    type: "Holiday",
  },
  {
    id: 4,
    title: "PTM Schedule",
    description: "Parent-Teacher Meeting on Saturday.",
    date: "18 Jul",
    type: "Announcement",
  },
];

function NoticeBadge({
  type,
}: {
  type: Notice["type"];
}) {
  switch (type) {
    case "Announcement":
      return (
        <Badge className="bg-blue-600 hover:bg-blue-600">
          Announcement
        </Badge>
      );

    case "Exam":
      return (
        <Badge className="bg-red-600 hover:bg-red-600">
          Exam
        </Badge>
      );

    case "Holiday":
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          Holiday
        </Badge>
      );
  }
}

export default function NoticeBoard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notice Board
          </CardTitle>

          <CardDescription>
            Latest announcements and updates
          </CardDescription>
        </div>

        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40"
          >
            <div className="mt-1 rounded-full bg-primary/10 p-2">
              {notice.type === "Exam" ? (
                <CalendarDays className="h-5 w-5 text-primary" />
              ) : (
                <Megaphone className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold">
                  {notice.title}
                </h4>

                <NoticeBadge type={notice.type} />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {notice.description}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {notice.date}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
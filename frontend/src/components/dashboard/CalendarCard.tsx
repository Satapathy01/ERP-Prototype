"use client";

import * as React from "react";
import { CalendarDays, Clock } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: "Mid-Term Examination",
    date: "21 Jul 2026",
    time: "09:00 AM",
  },
  {
    id: 2,
    title: "Parent Teacher Meeting",
    date: "25 Jul 2026",
    time: "10:30 AM",
  },
  {
    id: 3,
    title: "Science Exhibition",
    date: "30 Jul 2026",
    time: "11:00 AM",
  },
];

export default function CalendarCard() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date()
  );

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Calendar
        </CardTitle>

        <CardDescription>
          Schedule and upcoming events
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">
            Upcoming Events
          </h4>

          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border p-3 transition-colors hover:bg-muted/40"
            >
              <h5 className="font-medium">
                {event.title}
              </h5>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {event.date}
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {event.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
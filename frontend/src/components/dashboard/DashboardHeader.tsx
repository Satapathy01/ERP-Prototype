"use client";

import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({
  userName = "Admin",
  title = "Dashboard",
  subtitle = "Here's what's happening in your school today.",
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-center md:justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />

          <span className="text-sm font-semibold">
            {greeting}, {userName}
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
        <CalendarDays className="h-5 w-5 text-primary" />

        <div>
          <p className="text-xs text-muted-foreground">
            Today
          </p>

          <p className="font-medium">
            {today}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  loading = false,
  color = "bg-primary",
}: StatsCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:shadow-xl">
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight">
                    {value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              {trend !== undefined && (
                <div className="mt-6 flex items-center gap-2">
                  <div
                    className={`flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                      isPositive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
                    )}

                    {Math.abs(trend)}%
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {trendLabel ?? "Compared to last month"}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
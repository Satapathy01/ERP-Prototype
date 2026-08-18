"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const revenueData = [
  { month: "Jan", revenue: 125000 },
  { month: "Feb", revenue: 148000 },
  { month: "Mar", revenue: 162000 },
  { month: "Apr", revenue: 185000 },
  { month: "May", revenue: 176000 },
  { month: "Jun", revenue: 214000 },
  { month: "Jul", revenue: 238000 },
  { month: "Aug", revenue: 251000 },
  { month: "Sep", revenue: 267000 },
  { month: "Oct", revenue: 289000 },
  { month: "Nov", revenue: 305000 },
  { month: "Dec", revenue: 331000 },
];

export default function RevenueChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>

        <CardDescription>
          Monthly fee collection
        </CardDescription>
      </CardHeader>

      <CardContent className="h-87.5">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
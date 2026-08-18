"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const attendanceData = [
  {
    name: "Present",
    value: 892,
    color: "#22c55e",
  },
  {
    name: "Absent",
    value: 73,
    color: "#ef4444",
  },
  {
    name: "Late",
    value: 35,
    color: "#f59e0b",
  },
];

const totalStudents = attendanceData.reduce(
  (sum, item) => sum + item.value,
  0
);

const presentPercentage = Math.round(
  (attendanceData[0].value / totalStudents) * 100
);

export default function AttendanceChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Today&apos;s Attendance</CardTitle>

        <CardDescription>
          Student attendance overview
        </CardDescription>
      </CardHeader>

      <CardContent className="h-87.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={attendanceData}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={4}
              strokeWidth={0}
            >
              {attendanceData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">
            {presentPercentage}%
          </span>

          <span className="text-sm text-muted-foreground">
            Present
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
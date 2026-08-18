"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FinanceTableSkeletonProps {
  rows?: number;
}

export default function FinanceTableSkeleton({
  rows = 8,
}: FinanceTableSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {[
                  "Receipt",
                  "Student",
                  "Course",
                  "Amount",
                  "Method",
                  "Status",
                  "Date",
                  "Actions",
                ].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left"
                  >
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: rows }).map((_, row) => (
                <tr key={row} className="border-b">
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
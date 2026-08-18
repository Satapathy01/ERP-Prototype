"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@prisma/client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { DataTableColumnHeader } from "../DataTableColumnHeader";
import CourseDialog from "@/components/course/CourseDialog";
import DeleteCourseDialog from "@/components/course/DeleteCourseDialog";

interface CourseColumnsProps {
  schoolId: string;
}

export function getCourseColumns({
  schoolId,
}: CourseColumnsProps): ColumnDef<Course>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) =>
            row.toggleSelected(!!value)
          }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Code"
        />
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Course"
        />
      ),
    },

    {
      accessorKey: "durationMonths",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Duration"
        />
      ),
      cell: ({ row }) => (
        <span>{row.original.durationMonths} Months</span>
      ),
    },

    {
      accessorKey: "admissionFee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Admission Fee"
        />
      ),
      cell: ({ row }) => (
        <>₹{Number(row.original.admissionFee).toFixed(2)}</>
      ),
    },

    {
      accessorKey: "monthlyFee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Monthly Fee"
        />
      ),
      cell: ({ row }) => (
        <>₹{Number(row.original.monthlyFee).toFixed(2)}</>
      ),
    },

    {
      accessorKey: "totalFee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Total Fee"
        />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹{Number(row.original.totalFee).toFixed(2)}
        </span>
      ),
    },

    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge>Active</Badge>
        ) : (
          <Badge variant="destructive">
            Inactive
          </Badge>
        ),
    },

    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,

      cell: ({ row }) => {
        const course = row.original;

        return (
          <div className="flex gap-2">
            <CourseDialog
              schoolId={schoolId}
              course={course}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              }
            />

            <DeleteCourseDialog
              course={course}
            />
          </div>
        );
      },
    },
  ];
}
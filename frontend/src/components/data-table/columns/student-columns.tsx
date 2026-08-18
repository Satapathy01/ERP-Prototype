"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@prisma/client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "../DataTableColumnHeader";

import StudentDialog from "@/components/students/StudentDialog";
import DeleteStudentDialog from "@/components/students/DeleteStudentDialog";

interface StudentColumnsProps {
  schoolId: string;
}

export function getStudentColumns({
  schoolId,
}: StudentColumnsProps): ColumnDef<Student>[] {
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
      accessorKey: "registrationNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Registration No."
        />
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Student Name"
        />
      ),
    },

    {
      accessorKey: "fatherName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Father Name"
        />
      ),
      cell: ({ row }) => row.original.fatherName ?? "-",
    },

    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date of Birth"
        />
      ),
      cell: ({ row }) =>
        row.original.dateOfBirth
          ? new Date(row.original.dateOfBirth).toLocaleDateString()
          : "-",
    },

    {
  accessorKey: "studentPhone",
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title="Student Phone"
    />
  ),
  cell: ({ row }) => row.original.studentPhone ?? "-",
},

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "ACTIVE"
              ? "default"
              : "secondary"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },

    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,

      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className="flex items-center gap-2">
            <StudentDialog
              schoolId={schoolId}
              student={student}
            />

            <DeleteStudentDialog
              student={student}
            />
          </div>
        );
      },
    },
  ];
}
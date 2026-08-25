"use client";

import { Search } from "lucide-react";

import { Input } from "~/components/ui/input";

import { ImportDialog } from "./ImportDialog";
import { AddStudentDialog } from "./AddStudentDialog";

interface StudentToolbarProps {
  currentSearch: string;
}

export function StudentToolbar({
  currentSearch,
}: StudentToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Students
        </h1>

        <p className="text-muted-foreground">
          Manage students and import data from Excel.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          action="/dashboard/people/students"
          className="relative w-full max-w-sm"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            name="search"
            defaultValue={currentSearch}
            placeholder="Search by registration number, name or course..."
            className="pl-9"
          />
        </form>

        <div className="flex items-center gap-2">
          <ImportDialog />
          <AddStudentDialog />
        </div>
      </div>
    </div>
  );
}
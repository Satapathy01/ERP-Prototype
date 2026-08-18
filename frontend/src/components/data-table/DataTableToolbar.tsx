"use client";

import type { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "./DataTableViewOptions";
import type { BulkAction } from "./types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;

  searchColumn?: string;
  searchPlaceholder?: string;

  bulkActions?: BulkAction<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  searchColumn = "name",
  searchPlaceholder = "Search...",
  bulkActions = [],
}: DataTableToolbarProps<TData>) {
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={
            (table
              .getColumn(searchColumn)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(searchColumn)
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {selectedRows.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {selectedRows.length > 0 &&
          bulkActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant ?? "outline"}
              size="sm"
              disabled={action.disabled}
              onClick={() => action.onClick(selectedRows, table)}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
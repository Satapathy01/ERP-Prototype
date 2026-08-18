"use client";

import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTableExportProps<TData> {
  table: Table<TData>;
  fileName?: string;
}

export function DataTableExport<TData>({
  table,
  fileName = "export",
}: DataTableExportProps<TData>) {
  const exportCSV = () => {
    const rows =
      table.getFilteredSelectedRowModel().rows.length > 0
        ? table.getFilteredSelectedRowModel().rows
        : table.getFilteredRowModel().rows;

    const data = rows.map(
      (row) => row.original as Record<string, unknown>
    );

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);

    const csvRows = [
      headers.join(","),
      ...data.map((item) =>
        headers
          .map((header) => {
            const value = item[header] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csv = csvRows.join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportCSV}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
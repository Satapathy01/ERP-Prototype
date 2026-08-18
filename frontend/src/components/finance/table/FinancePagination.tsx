"use client";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FinancePaginationProps {
  pagination: Pagination;

  onPageChange: (page: number) => void;
}

export default function FinancePagination({
  pagination,
  onPageChange,
}: FinancePaginationProps) {
  const {
    page,
    totalPages,
    total,
    limit,
    hasNext,
    hasPrevious,
  } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{start}</span>
        {" - "}
        <span className="font-medium">{end}</span>
        {" of "}
        <span className="font-medium">{total}</span>{" "}
        payments
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!hasPrevious}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-30 text-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={!hasNext}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
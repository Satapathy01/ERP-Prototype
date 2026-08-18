import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

export interface BulkAction<TData> {
  /**
   * Unique identifier for the action.
   */
  id: string;

  /**
   * Button label.
   */
  label: string;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Button variant.
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";

  /**
   * Whether the action should be disabled.
   */
  disabled?: boolean;

  /**
   * Executed when the action is clicked.
   */
  onClick: (
    rows: TData[],
    table: Table<TData>
  ) => Promise<void> | void;
}
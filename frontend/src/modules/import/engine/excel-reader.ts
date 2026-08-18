import * as XLSX from "xlsx";
import { Prisma } from "@prisma/client";

export interface ExcelSheet {
  name: string;
  headers: string[];
  rows: Prisma.InputJsonObject[];
}

export function readExcel(buffer: Buffer): ExcelSheet {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("Excel file contains no sheets.");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<Prisma.InputJsonObject>(worksheet, {
    defval: "",
  });

  if (rows.length === 0) {
    throw new Error("Excel sheet is empty.");
  }

  const headers = Object.keys(rows[0]);

  return {
    name: firstSheetName,
    headers,
    rows,
  };
}
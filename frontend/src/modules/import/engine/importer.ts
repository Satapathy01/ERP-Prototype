import { readExcel } from "./excel-reader";
import { detectHeaders } from "./detector";
import { mapRow } from "./mapper";
import { validateRow } from "./validator";

import {
  HeaderMatch,
  ImportPreview,
  ImportPreviewRow,
} from "./types";

export async function buildImportPreview(
  buffer: Buffer,
  schoolId: string
): Promise<ImportPreview> {
  // --------------------------------------------------
  // Read Excel
  // --------------------------------------------------
  const excel = readExcel(buffer);

  // --------------------------------------------------
  // Detect Headers (Memory → Alias → Fuzzy → AI)
  // --------------------------------------------------
  const headers: HeaderMatch[] = await detectHeaders(
    excel.headers,
    schoolId
  );

  const rows: ImportPreviewRow[] = [];

  // --------------------------------------------------
  // Process Rows
  // --------------------------------------------------
  for (let i = 0; i < excel.rows.length; i++) {
    const raw = excel.rows[i];

    const mapped = mapRow(raw, headers);

    const validation = await validateRow(mapped);

    rows.push({
      rowNumber: i + 2, // Excel row (header is row 1)
      raw,
      mapped,
      validation,
    });
  }

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  const validRows = rows.filter(
    (row) => row.validation.valid
  ).length;

  const invalidRows = rows.length - validRows;

  // --------------------------------------------------
  // Preview Result
  // --------------------------------------------------
  return {
    headers,
    rows,
    totalRows: rows.length,
    validRows,
    invalidRows,
  };
}
import { randomUUID } from "crypto";

/**
 * Generates a unique admission barcode.
 *
 * Example:
 * ADM-20260714-8F4A91C2
 */
export function generateAdmissionBarcode(): string {
  const date = new Date();

  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  const random = randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();

  return `ADM-${y}${m}${d}-${random}`;
}
/**
 * Header Normalizer
 * -----------------
 * Converts Excel column headers into a standard format.
 *
 * Examples:
 * "Reg.No"          -> "registration number"
 * "REG_NO"          -> "registration number"
 * "Father's Name"   -> "father name"
 * "D.O.B"           -> "date of birth"
 * "D.O.A"           -> "date of admission"
 * "Amt."            -> "amount"
 * "Mob No"          -> "mobile number"
 */

const REPLACEMENTS: Record<string, string> = {
  // Registration
  "reg no": "registration number",
  "reg number": "registration number",
  "reg": "registration",
  "registration no": "registration number",

  // Dates
  "dob": "date of birth",
  "doa": "date of admission",

  // Amount
  "amt": "amount",

  // Mobile
  "mob": "mobile",
  "mob no": "mobile number",
  "mobile no": "mobile number",
  "ph": "phone",
  "ph no": "phone number",

  // Parents
  "fathers name": "father name",
  "mothers name": "mother name",

  // Receipt
  "mr no": "money receipt number",
  "receipt no": "receipt number",
};

export function normalizeHeader(header: string): string {
  if (!header) return "";

  let normalized = header
    .trim()
    .toLowerCase()

    // Remove apostrophes
    .replace(/['"`]/g, "")

    // Replace separators with spaces
    .replace(/[._\-\/\\]/g, " ")

    // Remove brackets
    .replace(/[()[\]{}]/g, "")

    // Remove remaining special characters
    .replace(/[^\w\s]/g, "")

    // Collapse multiple spaces
    .replace(/\s+/g, " ")

    .trim();

  // Apply intelligent replacements
  if (REPLACEMENTS[normalized]) {
    normalized = REPLACEMENTS[normalized];
  }

  return normalized;
}
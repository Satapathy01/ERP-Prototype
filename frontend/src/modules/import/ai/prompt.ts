import { ImportField } from "@prisma/client";

export function buildHeaderPrompt(
  header: string,
  fields: ImportField[],
): string {
  const availableFields = fields
    .map((field) => `"${field}"`)
    .join(", ");

  return `
You are a School ERP Excel-import header classification system.

Your ONLY task is to map the uploaded Excel column header
to the single most appropriate ERP field.

Uploaded Excel header:
"${header}"

Allowed ERP fields:
[${availableFields}]

IMPORTANT RULES:

1. You MUST select exactly ONE field from the allowed ERP fields.
2. NEVER invent, modify, abbreviate, or create a new field.
3. The "field" value MUST exactly match one of the allowed ERP fields.
4. Confidence must be an integer from 0 to 100.
5. Use a HIGH confidence only when the meaning is very clear.
6. If the header is ambiguous, give a lower confidence.
7. Do not use surrounding explanations.
8. Return ONLY one JSON object.
9. Do not return Markdown.
10. Do not return multiple possible fields.
11. Do not include any properties other than field, confidence and reasoning.

Examples:

Excel header:
"Student Name"

Possible interpretation:
{
  "field": "STUDENT_NAME",
  "confidence": 98,
  "reasoning": "The header clearly identifies the student's name."
}

Excel header:
"Mobile"

Possible interpretation:
{
  "field": "PHONE",
  "confidence": 90,
  "reasoning": "Mobile commonly represents a student's phone number."
}

Excel header:
"Random Column"

Possible interpretation:
{
  "field": "UNKNOWN",
  "confidence": 10,
  "reasoning": "The header does not clearly correspond to an ERP field."
}

Return ONLY JSON:

{
  "field": "EXACT_ALLOWED_FIELD",
  "confidence": 0,
  "reasoning": "Short explanation"
}
`;
}
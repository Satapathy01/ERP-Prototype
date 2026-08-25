import type { ExamRules } from "./exam-rules";

export function formatExamRulesResponse(
  rules: ExamRules,
): string {
  const lines: string[] = [];

  lines.push(
    "Examination rules updated successfully.",
  );

  lines.push(
    "",
    "The examination rules are now configured as follows:",
  );

  // Attendance
  lines.push(
    "",
    `• Attendance: ${
      rules.attendance.required
        ? "Required"
        : "Not required"
    }.`,
  );

  if (rules.attendance.required) {
    lines.push(
      `  Minimum attendance: ${rules.attendance.minimumPercentage}%.`,
    );

    lines.push(
      `  Scope: ${
        rules.attendance.scope === "EVERY_COURSE"
          ? "Every course"
          : "Overall attendance"
      }.`,
    );
  }

  // Payment
  lines.push(
    "",
    `• Payment: ${
      rules.payment.required
        ? "Required"
        : "Not required"
    }.`,
  );

  if (rules.payment.required) {
    lines.push(
      `  Minimum payment completion: ${rules.payment.minimumCompletionPercentage}%.`,
    );
  }

  // Theory
  lines.push(
    "",
    `• Theory examination: ${
      rules.theory.required
        ? "Required"
        : "Not required"
    }.`,
  );

  if (rules.theory.required) {
    lines.push(
      `  Must pass: ${
        rules.theory.mustPass
          ? "Yes"
          : "No"
      }.`,
    );
  }

  // Practical
  lines.push(
    "",
    `• Practical examination: ${
      rules.practical.required
        ? "Required"
        : "Not required"
    }.`,
  );

  if (rules.practical.required) {
    lines.push(
      `  Must pass: ${
        rules.practical.mustPass
          ? "Yes"
          : "No"
      }.`,
    );
  }

  // Certificate
  lines.push(
    "",
    `• Certificate: ${
      rules.certificate.required
        ? "Required"
        : "Not required"
    }.`,
  );

  if (rules.certificate.required) {
    lines.push(
      `  Certificate fee: ₹${rules.certificate.fee}.`,
    );
  }

  lines.push(
    "",
    "A new examination rule version has been created and activated.",
  );

  return lines.join("\n");
}
export function formatExamRulesHelp(): string {
  return `I can help you manage examination rules using natural language.

You can ask me to:

• Change the minimum attendance requirement
• Make attendance mandatory or optional
• Set attendance scope to every course or overall
• Configure payment requirements
• Set the minimum payment completion percentage
• Make theory examinations mandatory or optional
• Make practical examinations mandatory or optional
• Configure whether theory examinations must be passed
• Configure whether practical examinations must be passed
• Enable or disable certificate requirements
• Set the certificate fee
• Explain the current examination rules

Examples:

"Set minimum attendance to 75%."

"Students should have paid at least 80% before the exam."

"Practical examination should be optional."

"Students must pass both theory and practical."

"What are the current examination rules?"`;
}

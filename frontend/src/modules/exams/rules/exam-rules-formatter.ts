import type { ExamRules } from "./exam-rules";

export function formatExamRulesResponse(
  rules: ExamRules,
): string {
  const attendance = rules.attendance;
  const payment = rules.payment;
  const theory = rules.theory;
  const practical = rules.practical;
  const certificate = rules.certificate;

  return [
    "Here are the current examination rules:",
    "",
    `• Attendance: ${
      attendance.required
        ? "Required"
        : "Not required"
    }`,
    `  Minimum attendance: ${attendance.minimumPercentage}%`,
    `  Scope: ${formatAttendanceScope(attendance.scope)}`,
    "",
    `• Payment: ${
      payment.required
        ? "Required"
        : "Not required"
    }`,
    `  Minimum payment completion: ${payment.minimumCompletionPercentage}%`,
    "",
    `• Theory examination: ${
      theory.required
        ? "Required"
        : "Not required"
    }`,
    `  Must pass: ${
      theory.mustPass ? "Yes" : "No"
    }`,
    "",
    `• Practical examination: ${
      practical.required
        ? "Required"
        : "Not required"
    }`,
    `  Must pass: ${
      practical.mustPass
        ? "Yes"
        : "No"
    }`,
    "",
    `• Certificate: ${
      certificate.required
        ? "Required"
        : "Not required"
    }`,
    `  Certificate fee: ₹${certificate.fee}`,
  ].join("\n");
}

function formatAttendanceScope(
  scope: string,
): string {
  switch (scope) {
    case "EVERY_COURSE":
      return "Every course";

    case "OVERALL":
      return "Overall";

    default:
      return scope
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
          char.toUpperCase(),
        );
  }
}
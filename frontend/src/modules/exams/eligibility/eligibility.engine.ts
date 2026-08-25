import type {
  EligibilityEvaluation,
  EligibilityEvaluationContext,
} from "./eligibility.types";

export function evaluateEligibility(
  context: EligibilityEvaluationContext,
): EligibilityEvaluation {
  const {
    rules,
    paymentPercentage,
    courseAttendance,
    theoryPassed,
    practicalPassed,
  } = context;

  const reasons: string[] = [];

  /*
   * --------------------------------------------------
   * PAYMENT
   * --------------------------------------------------
   */

  const paymentRequired =
    rules.payment?.required ?? true;

  const minimumPaymentPercentage =
    rules.payment
      ?.minimumCompletionPercentage ?? 100;

  const paymentPassed =
    !paymentRequired ||
    paymentPercentage >=
      minimumPaymentPercentage;

  if (
    paymentRequired &&
    !paymentPassed
  ) {
    reasons.push(
      `Course payment is only ${paymentPercentage}% complete. Required: ${minimumPaymentPercentage}%.`,
    );
  }

  /*
   * --------------------------------------------------
   * ATTENDANCE
   * --------------------------------------------------
   */

  const attendanceRequired =
    rules.attendance?.required ?? true;

  const minimumAttendance =
    rules.attendance
      ?.minimumPercentage ?? 20;

  const attendanceScope =
    rules.attendance?.scope ??
    "EVERY_COURSE";

  let attendancePassed = true;

  if (attendanceRequired) {
    if (attendanceScope === "EVERY_COURSE") {
      attendancePassed =
        courseAttendance.length > 0 &&
        courseAttendance.every(
          (course) =>
            course.attendancePercentage >=
            minimumAttendance,
        );

      for (const course of courseAttendance) {
        if (
          course.attendancePercentage <
          minimumAttendance
        ) {
          reasons.push(
            `${course.courseName} attendance is ${course.attendancePercentage}%. Required: ${minimumAttendance}%.`,
          );
        }
      }
    } else {
      /*
       * OVERALL attendance can be supplied
       * as a single calculated course entry.
       */
      attendancePassed =
        courseAttendance.length > 0 &&
        courseAttendance.every(
          (course) =>
            course.attendancePercentage >=
            minimumAttendance,
        );

      if (!attendancePassed) {
        reasons.push(
          `Attendance requirement of ${minimumAttendance}% has not been satisfied.`,
        );
      }
    }
  }

  /*
   * --------------------------------------------------
   * THEORY
   * --------------------------------------------------
   */

  const theoryRequired =
    rules.theory?.required ?? true;

  const theoryMustPass =
    rules.theory?.mustPass ?? true;

  const theoryRequirementPassed =
    !theoryRequired ||
    !theoryMustPass ||
    theoryPassed;

  if (
    theoryRequired &&
    theoryMustPass &&
    !theoryPassed
  ) {
    reasons.push(
      "Theory examination has not been passed.",
    );
  }

  /*
   * --------------------------------------------------
   * PRACTICAL
   * --------------------------------------------------
   */

  const practicalRequired =
    rules.practical?.required ?? true;

  const practicalMustPass =
    rules.practical?.mustPass ?? true;

  const practicalRequirementPassed =
    !practicalRequired ||
    !practicalMustPass ||
    practicalPassed;

  if (
    practicalRequired &&
    practicalMustPass &&
    !practicalPassed
  ) {
    reasons.push(
      "Practical examination has not been passed.",
    );
  }

  /*
   * --------------------------------------------------
   * FINAL DECISION
   * --------------------------------------------------
   */

  const eligible =
    paymentPassed &&
    attendancePassed &&
    theoryRequirementPassed &&
    practicalRequirementPassed;

  return {
    payment: {
      required: paymentRequired,
      percentage: paymentPercentage,
      minimumPercentage:
        minimumPaymentPercentage,
      passed: paymentPassed,
    },

    attendance: {
      required: attendanceRequired,
      minimumPercentage:
        minimumAttendance,
      scope: attendanceScope,
      passed: attendancePassed,
      courses: courseAttendance,
    },

    theory: {
      required: theoryRequired,
      mustPass: theoryMustPass,
      passed: theoryRequirementPassed,
    },

    practical: {
      required: practicalRequired,
      mustPass: practicalMustPass,
      passed: practicalRequirementPassed,
    },

    eligible,
    reasons,
  };
}
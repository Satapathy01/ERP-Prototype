/**
 * Examination Module
 *
 * Central barrel export.
 *
 * Other modules should preferably import from:
 *
 * @/modules/exams
 *
 * instead of reaching into individual implementation files.
 */

/* --------------------------------------------------
 * Shared Types
 * -------------------------------------------------- */

export * from "./types";

/* --------------------------------------------------
 * Eligibility
 * -------------------------------------------------- */

export {
  examEligibilityService,
} from "./eligibility/eligibility.service";

export {
  evaluateEligibility,
} from "./eligibility/eligibility.engine";

export type {
  CourseAttendanceResult,
  EligibilityEvaluation,
  EligibilityRuleSet,
} from "./eligibility/eligibility.types";

/* --------------------------------------------------
 * Examination Rules
 * -------------------------------------------------- */

export {
  examRulesService,
} from "./rules/exam-rules.service";

/* --------------------------------------------------
 * Examination Sessions
 * -------------------------------------------------- */

export {
  examSessionService,
} from "./sessions/exam-session.service";

/* --------------------------------------------------
 * Examinations
 * -------------------------------------------------- */

export {
  examService,
} from "./exams/exam.service";

/* --------------------------------------------------
 * Registration
 * -------------------------------------------------- */

export {
  examRegistrationService,
} from "./registration/registration.service";

/* --------------------------------------------------
 * Results
 * -------------------------------------------------- */

export {
  examResultService,
} from "./results/result.service";

/* --------------------------------------------------
 * Graduation
 * -------------------------------------------------- */

export {
  graduationService,
} from "./graduation/graduation.service";

export type {
  GraduationResult,
} from "./graduation/graduation.service";

/* --------------------------------------------------
 * Certificates
 * -------------------------------------------------- */

export {
  certificateService,
} from "./certificates/certificate.service";

export {
  createCertificateSchema,
  certificateStatusSchema,
} from "./certificates/certificate.schema";

export type {
  CreateCertificateInput,
  CertificateStatusInput,
} from "./certificates/certificate.schema";
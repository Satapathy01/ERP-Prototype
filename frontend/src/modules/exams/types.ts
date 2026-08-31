import type {
  ExamStatus,
  ExamType,
  ExamRegistrationStatus,
  ResultStatus,
  EligibilityStatus,
  ExamSessionStatus,
} from "@prisma/client";

/**
 * Common examination identifiers.
 */
export interface ExamEntityContext {
  schoolId: string;
  sessionId: string;
  studentId?: string;
  admissionId?: string;
}

/**
 * Examination rule structure.
 *
 * This is intentionally flexible because rules can be
 * generated/updated dynamically.
 */
export interface ExamRules {
  payment?: {
    required?: boolean;
    minimumCompletionPercentage?: number;
  };

  attendance?: {
    required?: boolean;
    minimumPercentage?: number;
    scope?: "EVERY_COURSE" | "OVERALL" | string;
  };

  theory?: {
    required?: boolean;
    mustPass?: boolean;
  };

  practical?: {
    required?: boolean;
    mustPass?: boolean;
  };

  [key: string]: unknown;
}

/**
 * Examination rule set.
 */
export interface ExamRuleSetData {
  id: string;
  schoolId: string;

  name: string;
  description?: string | null;

  version: number;

  rules: ExamRules;

  isActive: boolean;

  effectiveFrom?: Date | null;
  effectiveUntil?: Date | null;

  createdBy?: string | null;
  approvedBy?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Examination session.
 */
export interface ExamSessionData {
  id: string;

  schoolId: string;

  name: string;
  code?: string | null;
  academicYear?: string | null;

  status: ExamSessionStatus;

  ruleSetId: string;

  startsAt?: Date | null;
  endsAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Individual theory/practical examination.
 */
export interface ExamData {
  id: string;

  sessionId: string;
  courseId: string;

  name: string;
  code?: string | null;

  type: ExamType;
  status: ExamStatus;

  maxMarks: number;
  passMarks: number;

  examDate?: Date | null;

  startTime?: Date | null;
  endTime?: Date | null;

  venue?: string | null;
  instructions?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student examination registration.
 */
export interface ExamRegistrationData {
  id: string;

  sessionId: string;
  examId: string;

  studentId: string;
  admissionId?: string | null;

  status: ExamRegistrationStatus;

  registeredAt?: Date | null;
  completedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Examination result.
 */
export interface ExamResultData {
  id: string;

  registrationId: string;

  marksObtained?: number | null;

  grade?: string | null;
  gradePoint?: number | null;

  percentage?: number | null;

  status: ResultStatus;

  remarks?: string | null;

  evaluatedBy?: string | null;
  evaluatedAt?: Date | null;

  publishedAt?: Date | null;
  publishedBy?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course-level attendance used during eligibility.
 */
export interface CourseAttendanceResult {
  courseId: string;

  courseName?: string;

  attendancePercentage: number;

  minimumPercentage: number;

  passed: boolean;
}

/**
 * Eligibility evaluation snapshot.
 *
 * This object is stored in ExamEligibility.evaluation.
 */
export interface EligibilityEvaluation {
  eligible: boolean;

  reasons: string[];

  payment: {
    required: boolean;
    percentage: number;
    minimumPercentage: number;
    passed: boolean;
  };

  attendance: {
    required: boolean;
    minimumPercentage: number;
    scope: string;
    passed: boolean;
    courses: CourseAttendanceResult[];
  };

  theory: {
    required: boolean;
    mustPass: boolean;
    passed: boolean;
  };

  practical: {
    required: boolean;
    mustPass: boolean;
    passed: boolean;
  };
}

/**
 * Student examination eligibility.
 */
export interface ExamEligibilityData {
  id: string;

  sessionId: string;

  studentId: string;
  admissionId?: string | null;

  registrationId?: string | null;

  status: EligibilityStatus;

  ruleSetId: string;
  ruleVersion: number;

  evaluation: EligibilityEvaluation;

  evaluatedAt?: Date | null;
  evaluatedBy?: string | null;

  overrideReason?: string | null;
  overriddenBy?: string | null;
  overriddenAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Graduation evaluation.
 */
export interface GraduationEvaluation {
  graduated: boolean;

  theoryPassed: boolean;
  practicalPassed: boolean;

  reasons: string[];
}

/**
 * Certificate creation information.
 *
 * Certificate generation itself belongs to the
 * existing certificate domain.
 */
export interface CertificateEligibility {
  canCreateCertificate: boolean;

  certificateFee: number;

  graduationPassed: boolean;

  certificateNumberRequired: boolean;
}
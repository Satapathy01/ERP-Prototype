export interface PaymentEligibilityResult {
  required: boolean;
  percentage: number;
  minimumPercentage: number;
  passed: boolean;
}

export interface CourseAttendanceResult {
  courseId: string;
  courseName: string;
  attendancePercentage: number;
  minimumPercentage: number;
  passed: boolean;
}

export interface AttendanceEligibilityResult {
  required: boolean;
  minimumPercentage: number;
  scope: "EVERY_COURSE" | "OVERALL";
  passed: boolean;
  courses: CourseAttendanceResult[];
}

export interface ExamRequirementResult {
  required: boolean;
  mustPass: boolean;
  passed: boolean;
}

export interface EligibilityEvaluation {
  payment: PaymentEligibilityResult;

  attendance: AttendanceEligibilityResult;

  theory: ExamRequirementResult;

  practical: ExamRequirementResult;

  eligible: boolean;

  reasons: string[];
}

export interface EligibilityRuleSet {
  payment?: {
    required?: boolean;
    minimumCompletionPercentage?: number;
  };

  attendance?: {
    required?: boolean;
    minimumPercentage?: number;
    scope?: "EVERY_COURSE" | "OVERALL";
  };

  theory?: {
    required?: boolean;
    mustPass?: boolean;
  };

  practical?: {
    required?: boolean;
    mustPass?: boolean;
  };

  certificate?: {
    required?: boolean;
    fee?: number;
  };

  grading?: Record<
    string,
    {
      minimum: number;
      point: number;
    }
  >;
}

export interface EligibilityEvaluationContext {
  studentId: string;
  sessionId: string;
  admissionId?: string | null;

  rules: EligibilityRuleSet;

  /**
   * Payment completion percentage for the admission.
   */
  paymentPercentage: number;

  /**
   * Attendance percentage for every enrolled course.
   */
  courseAttendance: CourseAttendanceResult[];

  /**
   * Existing theory result status.
   */
  theoryPassed: boolean;

  /**
   * Existing practical result status.
   */
  practicalPassed: boolean;
}

export interface EligibilityEvaluationOutput
  extends EligibilityEvaluation {
  ruleSetId: string;
  ruleVersion: number;

  evaluatedAt: Date;
}
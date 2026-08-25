import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import {
  evaluateEligibility,
} from "./eligibility.engine";

import {
  eligibilityEvaluationSchema,
  type EligibilityEvaluationInput,
} from "./eligibility.schema";

import type {
  CourseAttendanceResult,
  EligibilityRuleSet,
} from "./eligibility.types";

interface EvaluateEligibilityOptions {
  /**
   * Attendance calculated by the Attendance module.
   *
   * We deliberately do not query an assumed Prisma
   * attendance model here because attendance belongs
   * to its own module.
   */
  courseAttendance: CourseAttendanceResult[];

  evaluatedBy?: string;
}

export const examEligibilityService = {
  /**
   * Evaluate and persist examination eligibility.
   *
   * Rules:
   *
   * 1. Payment completion
   * 2. Attendance requirement
   * 3. Theory result
   * 4. Practical result
   */
  async evaluate(
    input: EligibilityEvaluationInput,
    options: EvaluateEligibilityOptions,
  ) {
    const data =
      eligibilityEvaluationSchema.parse(input);

    /*
     * --------------------------------------------------
     * 1. Load examination session + rule set
     * --------------------------------------------------
     */

    const session =
      await prisma.examSession.findUnique({
        where: {
          id: data.sessionId,
        },

        include: {
          ruleSet: true,
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    /*
     * --------------------------------------------------
     * 2. Find the student's admission(s)
     * --------------------------------------------------
     *
     * A student can have multiple course admissions.
     * Eligibility attendance is evaluated across those
     * enrolled courses.
     */

    const admissions =
      await prisma.admission.findMany({
        where: {
          studentId: data.studentId,
          isActive: true,

          ...(data.admissionId
            ? {
                id: data.admissionId,
              }
            : {}),
        },

        include: {
          course: true,
          feeLedger: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    if (admissions.length === 0) {
      throw new Error(
        "No active admission found for this student.",
      );
    }

    /*
     * --------------------------------------------------
     * 3. Determine admission
     * --------------------------------------------------
     *
     * If a specific admission was supplied, use it.
     * Otherwise the eligibility evaluation covers the
     * student's active course admissions.
     */

    const admission =
      data.admissionId
        ? admissions.find(
            (item) =>
              item.id ===
              data.admissionId,
          )
        : admissions[0];

    if (
      data.admissionId &&
      !admission
    ) {
      throw new Error(
        "The specified admission does not belong to this student.",
      );
    }

    /*
     * --------------------------------------------------
     * 4. Calculate payment completion
     * --------------------------------------------------
     *
     * FeeLedger contains:
     *
     * amount
     * paidAmount
     *
     * We calculate:
     *
     * total paid / total payable * 100
     */

    let totalAmount = 0;
    let totalPaid = 0;

    for (const currentAdmission of admissions) {
      for (const ledger of currentAdmission.feeLedger) {
        totalAmount += Number(
          ledger.amount,
        );

        totalPaid += Number(
          ledger.paidAmount,
        );
      }
    }

    const paymentPercentage =
      totalAmount > 0
        ? Math.min(
            100,
            Math.round(
              (totalPaid /
                totalAmount) *
                10000,
            ) / 100,
          )
        : 0;

    /*
     * --------------------------------------------------
     * 5. Load theory/practical results
     * --------------------------------------------------
     */

    const registrations =
      await prisma.examRegistration.findMany({
        where: {
          sessionId: data.sessionId,
          studentId: data.studentId,
        },

        include: {
          exam: true,
          result: true,
        },
      });

    /*
     * A theory requirement is satisfied only when
     * at least one theory examination has PASS.
     */

    const theoryResults =
      registrations.filter(
        (registration) =>
          registration.exam.type ===
          "THEORY",
      );

    const practicalResults =
      registrations.filter(
        (registration) =>
          registration.exam.type ===
          "PRACTICAL",
      );

    const theoryPassed =
      theoryResults.length > 0 &&
      theoryResults.some(
        (registration) =>
          registration.result?.status ===
          "PASS",
      );

    const practicalPassed =
      practicalResults.length > 0 &&
      practicalResults.some(
        (registration) =>
          registration.result?.status ===
          "PASS",
      );

    /*
     * --------------------------------------------------
     * 6. Read dynamic rules
     * --------------------------------------------------
     */

    const rules =
      session.ruleSet.rules as EligibilityRuleSet;

    /*
     * --------------------------------------------------
     * 7. Run deterministic eligibility engine
     * --------------------------------------------------
     */

    const evaluation =
      evaluateEligibility({
        studentId: data.studentId,

        sessionId: data.sessionId,

        admissionId:
          admission?.id ?? null,

        rules,

        paymentPercentage,

        courseAttendance:
          options.courseAttendance,

        theoryPassed,

        practicalPassed,
      });

    /*
     * --------------------------------------------------
     * 8. Persist eligibility
     * --------------------------------------------------
     *
     * The evaluation is stored as a snapshot.
     *
     * This is important because the Qwen-generated
     * rules may change later.
     */

    const eligibility =
      await prisma.examEligibility.upsert({
        where: {
          /*
           * ExamEligibility currently has a unique
           * registrationId, but not a unique
           * [sessionId, studentId] constraint.
           *
           * Therefore we first look for the latest
           * existing eligibility below.
           */
          id: (
            await prisma.examEligibility.findFirst({
              where: {
                sessionId:
                  data.sessionId,

                studentId:
                  data.studentId,

                ...(data.admissionId
                  ? {
                      admissionId:
                        data.admissionId,
                    }
                  : {}),
              },

              orderBy: {
                createdAt: "desc",
              },

              select: {
                id: true,
              },
            })
          )?.id ?? "__new__",
        },

        create: {
          sessionId:
            data.sessionId,

          studentId:
            data.studentId,

          admissionId:
            admission?.id ?? null,

          status: evaluation.eligible
            ? "ELIGIBLE"
            : "NOT_ELIGIBLE",

          ruleSetId:
            session.ruleSet.id,

          ruleVersion:
            session.ruleSet.version,

          evaluation:
            evaluation as unknown as Prisma.InputJsonValue,

          evaluatedAt:
            new Date(),

          evaluatedBy:
            options.evaluatedBy ??
            null,
        },

        update: {
          status: evaluation.eligible
            ? "ELIGIBLE"
            : "NOT_ELIGIBLE",

          ruleSetId:
            session.ruleSet.id,

          ruleVersion:
            session.ruleSet.version,

          evaluation:
            evaluation as unknown as Prisma.InputJsonValue,

          evaluatedAt:
            new Date(),

          evaluatedBy:
            options.evaluatedBy ??
            null,

          /*
           * Do not clear an existing override
           * automatically.
           *
           * An explicit override should be handled
           * by a separate operation.
           */
        },
      });

    return {
      eligibility,
      evaluation,
      payment: {
        totalAmount,
        totalPaid,
        percentage:
          paymentPercentage,
      },
      attendance:
        options.courseAttendance,
      exams: {
        theoryPassed,
        practicalPassed,
      },
      ruleSet: {
        id: session.ruleSet.id,
        version:
          session.ruleSet.version,
      },
    };
  },

  /**
   * Get the latest eligibility evaluation
   * for a student and examination session.
   */
  async getLatest(
    studentId: string,
    sessionId: string,
  ) {
    return prisma.examEligibility.findFirst({
      where: {
        studentId,
        sessionId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        session: {
          include: {
            ruleSet: true,
          },
        },

        registration: true,
      },
    });
  },

  /**
   * Check whether a student is currently eligible.
   */
  async isEligible(
    studentId: string,
    sessionId: string,
  ) {
    const eligibility =
      await this.getLatest(
        studentId,
        sessionId,
      );

    return (
      eligibility?.status ===
      "ELIGIBLE"
    );
  },

  /**
   * Override an eligibility decision.
   *
   * This should only be available to an
   * authorized administrator.
   */
  async override(
    id: string,
    reason: string,
    overriddenBy: string,
  ) {
    if (!reason.trim()) {
      throw new Error(
        "An override reason is required.",
      );
    }

    if (!overriddenBy.trim()) {
      throw new Error(
        "The user performing the override is required.",
      );
    }

    const existing =
      await prisma.examEligibility.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new Error(
        "Eligibility record not found.",
      );
    }

    return prisma.examEligibility.update({
      where: {
        id,
      },

      data: {
        status: "OVERRIDDEN",

        overrideReason:
          reason.trim(),

        overriddenBy:
          overriddenBy.trim(),

        overriddenAt:
          new Date(),
      },
    });
  },

  /**
   * Remove an override and restore the
   * previously calculated eligibility.
   */
  async removeOverride(id: string) {
    const existing =
      await prisma.examEligibility.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new Error(
        "Eligibility record not found.",
      );
    }

    const evaluation =
      existing.evaluation as {
        eligible?: boolean;
      };

    const status =
      evaluation.eligible
        ? "ELIGIBLE"
        : "NOT_ELIGIBLE";

    return prisma.examEligibility.update({
      where: {
        id,
      },

      data: {
        status,

        overrideReason: null,
        overriddenBy: null,
        overriddenAt: null,
      },
    });
  },
};
import { prisma } from "@/lib/prisma";

import {
  examResultSchema,
  type ExamResultInput,
} from "./result.schema";

interface GradingRule {
  minimum: number;
  point: number;
}

type GradingRules = Record<
  string,
  GradingRule
>;

interface ExamRules {
  grading?: GradingRules;
}

function calculateGrade(
  percentage: number,
  passed: boolean,
  gradingRules?: GradingRules,
): {
  grade: string;
  gradePoint: number;
} {
  /*
   * Failed examinations always receive F.
   *
   * This takes priority over every grading rule.
   */
  if (!passed) {
    return {
      grade: "F",
      gradePoint: 0,
    };
  }

  /*
   * No grading configuration.
   *
   * A passed examination should not silently
   * receive an arbitrary grade.
   */
  if (!gradingRules) {
    throw new Error(
      "Grading rules are not configured for this examination session.",
    );
  }

  /*
   * Convert the grading object into an array
   * and sort from highest minimum to lowest.
   *
   * Example:
   *
   * O   90
   * A+  80
   * A   70
   * ...
   */
  const bands = Object.entries(
    gradingRules,
  )
    .map(([grade, rule]) => ({
      grade,
      minimum: Number(rule.minimum),
      point: Number(rule.point),
    }))
    .filter(
      (rule) =>
        Number.isFinite(rule.minimum) &&
        Number.isFinite(rule.point),
    )
    .sort(
      (a, b) =>
        b.minimum - a.minimum,
    );

  const matchingBand = bands.find(
    (band) =>
      percentage >= band.minimum,
  );

  if (!matchingBand) {
    throw new Error(
      `No grading band matches percentage ${percentage}.`,
    );
  }

  return {
    grade: matchingBand.grade,
    gradePoint: matchingBand.point,
  };
}

export const examResultService = {
  /**
   * Enter or update an examination result.
   *
   * Grade and grade point are calculated server-side.
   * Values supplied by the client are NOT trusted.
   */
  async save(input: ExamResultInput) {
    const data =
      examResultSchema.parse(input);

    /*
     * --------------------------------------------------
     * 1. Find registration
     * --------------------------------------------------
     */

    const registration =
      await prisma.examRegistration.findUnique({
        where: {
          id: data.registrationId,
        },

        include: {
          exam: {
            include: {
              session: {
                include: {
                  ruleSet: true,
                },
              },
            },
          },

          result: true,
        },
      });

    if (!registration) {
      throw new Error(
        "Exam registration not found.",
      );
    }

    /*
     * --------------------------------------------------
     * 2. Validate marks
     * --------------------------------------------------
     */

    const maxMarks = Number(
      registration.exam.maxMarks,
    );

    const passMarks = Number(
      registration.exam.passMarks,
    );

    if (data.marksObtained > maxMarks) {
      throw new Error(
        `Marks obtained cannot exceed maximum marks (${maxMarks}).`,
      );
    }

    /*
     * --------------------------------------------------
     * 3. Calculate percentage
     * --------------------------------------------------
     */

    const percentage =
      maxMarks > 0
        ? (data.marksObtained / maxMarks) *
          100
        : 0;

    /*
     * Round percentage to two decimal places.
     */
    const roundedPercentage =
      Math.round(
        percentage * 100,
      ) / 100;

    /*
     * --------------------------------------------------
     * 4. Determine PASS / FAIL
     * --------------------------------------------------
     */

    const passed =
      data.marksObtained >= passMarks;

    const status = passed
      ? "PASS"
      : "FAIL";

    /*
     * --------------------------------------------------
     * 5. Read dynamic grading rules
     * --------------------------------------------------
     */

    const rules =
      registration.exam.session
        .ruleSet.rules as ExamRules;

    /*
     * --------------------------------------------------
     * 6. Calculate grade
     * --------------------------------------------------
     */

    const {
      grade,
      gradePoint,
    } = calculateGrade(
      roundedPercentage,
      passed,
      rules.grading,
    );

    /*
     * --------------------------------------------------
     * 7. Save result
     * --------------------------------------------------
     */

    return prisma.$transaction(
      async (tx) => {
        const result =
          await tx.examResult.upsert({
            where: {
              registrationId:
                data.registrationId,
            },

            create: {
              registrationId:
                data.registrationId,

              marksObtained:
                data.marksObtained,

              grade,

              gradePoint,

              percentage:
                roundedPercentage,

              status,

              remarks:
                data.remarks || null,

              evaluatedAt:
                new Date(),
            },

            update: {
              marksObtained:
                data.marksObtained,

              grade,

              gradePoint,

              percentage:
                roundedPercentage,

              status,

              remarks:
                data.remarks || null,

              evaluatedAt:
                new Date(),
            },
          });

        await tx.examRegistration.update({
          where: {
            id: data.registrationId,
          },

          data: {
            status: "COMPLETED",

            completedAt:
              new Date(),
          },
        });

        return result;
      },
    );
  },

  /**
   * Get one result.
   */
  async getById(id: string) {
    return prisma.examResult.findUnique({
      where: {
        id,
      },

      include: {
        registration: {
          include: {
            exam: {
              include: {
                course: true,
                session: {
                  include: {
                    ruleSet: true,
                  },
                },
              },
            },

            session: true,
          },
        },
      },
    });
  },

  /**
   * Get result by registration.
   */
  async getByRegistration(
    registrationId: string,
  ) {
    return prisma.examResult.findUnique({
      where: {
        registrationId,
      },

      include: {
        registration: {
          include: {
            exam: {
              include: {
                course: true,
              },
            },

            session: true,
          },
        },
      },
    });
  },

  /**
   * Get all results for a student
   * in an examination session.
   */
  async getStudentResults(
    studentId: string,
    sessionId: string,
  ) {
    return prisma.examResult.findMany({
      where: {
        registration: {
          studentId,
          sessionId,
        },
      },

      include: {
        registration: {
          include: {
            exam: {
              include: {
                course: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  },

  /**
   * Publish a result.
   *
   * Evaluation and publication remain
   * separate operations.
   */
  async publish(
    id: string,
    publishedBy?: string,
  ) {
    const result =
      await prisma.examResult.findUnique({
        where: {
          id,
        },
      });

    if (!result) {
      throw new Error(
        "Exam result not found.",
      );
    }

    return prisma.examResult.update({
      where: {
        id,
      },

      data: {
        publishedAt: new Date(),

        publishedBy:
          publishedBy ?? null,
      },
    });
  },

  /**
   * Unpublish a result.
   */
  async unpublish(id: string) {
    return prisma.examResult.update({
      where: {
        id,
      },

      data: {
        publishedAt: null,
        publishedBy: null,
      },
    });
  },
};
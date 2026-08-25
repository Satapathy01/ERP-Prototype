import { prisma } from "@/lib/prisma";

export interface GraduationResult {
  graduated: boolean;

  studentId: string;
  admissionId: string | null;
  sessionId: string;

  certificateEligible: boolean;
  certificateFee: number;

  reasons: string[];

  examinations: {
    totalRequired: number;
    totalCompleted: number;
    totalPassed: number;
    theoryPassed: boolean;
    practicalPassed: boolean;
  };
}

export const graduationService = {
  async evaluate(
    studentId: string,
    sessionId: string,
  ): Promise<GraduationResult> {
    const reasons: string[] = [];

    /*
     * --------------------------------------------------
     * 1. Load examination session
     * --------------------------------------------------
     */

    const session =
      await prisma.examSession.findUnique({
        where: {
          id: sessionId,
        },

        include: {
          ruleSet: true,

          exams: {
            include: {
              course: true,

              registrations: {
                where: {
                  studentId,
                },

                include: {
                  result: true,
                },
              },
            },
          },

          eligibilities: {
            where: {
              studentId,
            },

            orderBy: {
              evaluatedAt: "desc",
            },

            take: 1,
          },
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    /*
     * --------------------------------------------------
     * 2. Eligibility
     * --------------------------------------------------
     *
     * Payment + attendance + any other dynamic
     * eligibility rules are evaluated by the
     * eligibility service.
     */

    const eligibility =
      session.eligibilities[0];

    if (!eligibility) {
      reasons.push(
        "Examination eligibility has not been evaluated.",
      );
    } else if (
      eligibility.status !== "ELIGIBLE"
    ) {
      reasons.push(
        "Student is not eligible for the examination.",
      );
    }

    /*
     * --------------------------------------------------
     * 3. Read examination rules
     * --------------------------------------------------
     */

    const rules =
      session.ruleSet.rules as {
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
      };

    const theoryRequired =
      rules.theory?.required ?? true;

    const theoryMustPass =
      rules.theory?.mustPass ?? true;

    const practicalRequired =
      rules.practical?.required ?? true;

    const practicalMustPass =
      rules.practical?.mustPass ?? true;

    /*
     * --------------------------------------------------
     * 4. Determine required exams
     * --------------------------------------------------
     *
     * Every course represented in the session must
     * have its required theory/practical examination.
     */

    const requiredExams =
      session.exams.filter((exam) => {
        if (exam.type === "THEORY") {
          return theoryRequired;
        }

        if (exam.type === "PRACTICAL") {
          return practicalRequired;
        }

        return false;
      });

    if (requiredExams.length === 0) {
      reasons.push(
        "No required examinations have been configured for this session.",
      );
    }

    /*
     * --------------------------------------------------
     * 5. Evaluate every required exam
     * --------------------------------------------------
     */

    let totalCompleted = 0;
    let totalPassed = 0;

    let theoryPassed = true;
    let practicalPassed = true;

    for (const exam of requiredExams) {
      const registration =
        exam.registrations[0];

      /*
       * No registration.
       */
      if (!registration) {
        reasons.push(
          `${exam.course.name}: ${exam.name} has not been registered.`,
        );

        if (exam.type === "THEORY") {
          theoryPassed = false;
        }

        if (exam.type === "PRACTICAL") {
          practicalPassed = false;
        }

        continue;
      }

      /*
       * Registration exists but result doesn't.
       */
      if (!registration.result) {
        reasons.push(
          `${exam.course.name}: ${exam.name} result has not been entered.`,
        );

        if (exam.type === "THEORY") {
          theoryPassed = false;
        }

        if (exam.type === "PRACTICAL") {
          practicalPassed = false;
        }

        continue;
      }

      totalCompleted++;

      /*
       * Result exists but student failed.
       */
      if (
        registration.result.status !==
        "PASS"
      ) {
        reasons.push(
          `${exam.course.name}: ${exam.name} has not been passed.`,
        );

        if (exam.type === "THEORY") {
          theoryPassed = false;
        }

        if (exam.type === "PRACTICAL") {
          practicalPassed = false;
        }

        continue;
      }

      totalPassed++;
    }

    /*
     * --------------------------------------------------
     * 6. Apply Theory requirement
     * --------------------------------------------------
     */

    if (
      theoryRequired &&
      theoryMustPass &&
      !theoryPassed
    ) {
      if (
        !reasons.some((reason) =>
          reason
            .toLowerCase()
            .includes("theory"),
        )
      ) {
        reasons.push(
          "Theory examination has not been passed.",
        );
      }
    }

    /*
     * --------------------------------------------------
     * 7. Apply Practical requirement
     * --------------------------------------------------
     */

    if (
      practicalRequired &&
      practicalMustPass &&
      !practicalPassed
    ) {
      if (
        !reasons.some((reason) =>
          reason
            .toLowerCase()
            .includes("practical"),
        )
      ) {
        reasons.push(
          "Practical examination has not been passed.",
        );
      }
    }

    /*
     * --------------------------------------------------
     * 8. Final graduation decision
     * --------------------------------------------------
     */

    const graduated =
      reasons.length === 0;

    const certificateRequired =
      rules.certificate?.required ??
      true;

    const certificateFee =
      Number(
        rules.certificate?.fee ?? 500,
      );

    return {
      graduated,

      studentId,

      admissionId:
        eligibility?.admissionId ?? null,

      sessionId,

      certificateEligible:
        graduated &&
        certificateRequired,

      certificateFee,

      reasons,

      examinations: {
        totalRequired:
          requiredExams.length,

        totalCompleted,

        totalPassed,

        theoryPassed,

        practicalPassed,
      },
    };
  },
};
import { prisma } from "@/lib/prisma";

import {
  examRegistrationSchema,
  type ExamRegistrationInput,
} from "./registration.schema";

export const examRegistrationService = {
  /**
   * Register one student for one examination.
   *
   * Eligibility must already be ELIGIBLE.
   */
  async register(
    input: ExamRegistrationInput,
  ) {
    const data =
      examRegistrationSchema.parse(input);

    /*
     * --------------------------------------------------
     * 1. Verify exam
     * --------------------------------------------------
     */

    const exam =
      await prisma.exam.findUnique({
        where: {
          id: data.examId,
        },

        include: {
          session: {
            select: {
              id: true,
              schoolId: true,
              status: true,
            },
          },
        },
      });

    if (!exam) {
      throw new Error(
        "Examination not found.",
      );
    }

    /*
     * The exam must belong to the supplied session.
     */

    if (
      exam.sessionId !== data.sessionId
    ) {
      throw new Error(
        "Exam does not belong to this examination session.",
      );
    }

    /*
     * --------------------------------------------------
     * 2. Verify student
     * --------------------------------------------------
     */

    const student =
      await prisma.student.findUnique({
        where: {
          id: data.studentId,
        },

        select: {
          id: true,
          schoolId: true,
        },
      });

    if (!student) {
      throw new Error(
        "Student not found.",
      );
    }

    if (
      student.schoolId !==
      exam.session.schoolId
    ) {
      throw new Error(
        "Student does not belong to the same school.",
      );
    }

    /*
     * --------------------------------------------------
     * 3. Verify eligibility
     * --------------------------------------------------
     */

    const eligibility =
      await prisma.examEligibility.findFirst({
        where: {
          sessionId: data.sessionId,
          studentId: data.studentId,
        },

        orderBy: {
          evaluatedAt: "desc",
        },
      });

    if (!eligibility) {
      throw new Error(
        "Student examination eligibility has not been evaluated.",
      );
    }

    if (
      eligibility.status !== "ELIGIBLE"
    ) {
      throw new Error(
        "Student is not eligible for examination registration.",
      );
    }

    /*
     * --------------------------------------------------
     * 4. Check existing registration
     * --------------------------------------------------
     */

    const existing =
      await prisma.examRegistration.findUnique({
        where: {
          sessionId_examId_studentId: {
            sessionId: data.sessionId,
            examId: data.examId,
            studentId: data.studentId,
          },
        },
      });

    if (existing) {
      return existing;
    }

    /*
     * --------------------------------------------------
     * 5. Create registration
     * --------------------------------------------------
     */

    return prisma.examRegistration.create({
      data: {
        sessionId: data.sessionId,

        examId: data.examId,

        studentId: data.studentId,

        admissionId:
          data.admissionId || null,

        status: "REGISTERED",

        registeredAt: new Date(),
      },

      include: {
        exam: {
          include: {
            course: true,
          },
        },

        session: true,

        result: true,

        eligibility: true,
      },
    });
  },

  /**
   * Register a student for all exams in a session.
   *
   * This is the preferred method when the student
   * is eligible for the complete examination.
   */
  async registerStudentForSession({
    sessionId,
    studentId,
    admissionId,
  }: {
    sessionId: string;
    studentId: string;
    admissionId?: string;
  }) {
    /*
     * Verify eligibility first.
     */

    const eligibility =
      await prisma.examEligibility.findFirst({
        where: {
          sessionId,
          studentId,
        },

        orderBy: {
          evaluatedAt: "desc",
        },
      });

    if (!eligibility) {
      throw new Error(
        "Student examination eligibility has not been evaluated.",
      );
    }

    if (
      eligibility.status !== "ELIGIBLE"
    ) {
      throw new Error(
        "Student is not eligible for examination registration.",
      );
    }

    /*
     * Get all exams in the session.
     */

    const exams =
      await prisma.exam.findMany({
        where: {
          sessionId,
        },

        select: {
          id: true,
        },

        orderBy: {
          examDate: "asc",
        },
      });

    if (exams.length === 0) {
      throw new Error(
        "No examinations have been created for this session.",
      );
    }

    /*
     * Use a transaction so either all registrations
     * are created or none are.
     */

    return prisma.$transaction(
      async (tx) => {
        const registrations = [];

        for (const exam of exams) {
          const registration =
            await tx.examRegistration.upsert({
              where: {
                sessionId_examId_studentId: {
                  sessionId,
                  examId: exam.id,
                  studentId,
                },
              },

              create: {
                sessionId,
                examId: exam.id,
                studentId,

                admissionId:
                  admissionId || null,

                status: "REGISTERED",

                registeredAt:
                  new Date(),
              },

              update: {},
            });

          registrations.push(
            registration,
          );
        }

        return registrations;
      },
    );
  },

  /**
   * Get registrations for a student.
   */
  async getByStudent(
    studentId: string,
    sessionId?: string,
  ) {
    return prisma.examRegistration.findMany({
      where: {
        studentId,

        ...(sessionId
          ? {
              sessionId,
            }
          : {}),
      },

      include: {
        exam: {
          include: {
            course: true,
          },
        },

        session: true,

        result: true,

        eligibility: true,
      },

      orderBy: {
        registeredAt: "asc",
      },
    });
  },

  /**
   * Get all registrations for a session.
   */
  async getBySession(
    sessionId: string,
  ) {
    return prisma.examRegistration.findMany({
      where: {
        sessionId,
      },

      include: {
        exam: {
          include: {
            course: true,
          },
        },

        result: true,

        eligibility: true,
      },

      orderBy: {
        registeredAt: "asc",
      },
    });
  },

  /**
   * Get one registration.
   */
  async getById(id: string) {
    return prisma.examRegistration.findUnique({
      where: {
        id,
      },

      include: {
        exam: {
          include: {
            course: true,
          },
        },

        session: true,

        result: true,

        eligibility: true,
      },
    });
  },

  /**
   * Mark a registration as completed.
   *
   * This should normally happen after the result
   * has been entered.
   */
  async complete(id: string) {
    const registration =
      await prisma.examRegistration.findUnique({
        where: {
          id,
        },

        include: {
          result: true,
        },
      });

    if (!registration) {
      throw new Error(
        "Exam registration not found.",
      );
    }

    if (!registration.result) {
      throw new Error(
        "Cannot complete registration before an exam result exists.",
      );
    }

    return prisma.examRegistration.update({
      where: {
        id,
      },

      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },

      include: {
        exam: true,
        result: true,
      },
    });
  },
};
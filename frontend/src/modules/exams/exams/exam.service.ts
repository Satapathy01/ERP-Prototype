import { prisma } from "@/lib/prisma";

import {
  examSchema,
  type ExamInput,
} from "./exam.schema";

export const examService = {
  /**
   * Get all exams belonging to a session.
   */
  async getBySession(sessionId: string) {
    return prisma.exam.findMany({
      where: {
        sessionId,
      },

      include: {
        course: true,

        session: {
          include: {
            ruleSet: true,
          },
        },

        _count: {
          select: {
            registrations: true,
          },
        },
      },

      orderBy: [
        {
          examDate: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  },

  /**
   * Get one exam.
   */
  async getById(id: string) {
    return prisma.exam.findUnique({
      where: {
        id,
      },

      include: {
        course: true,
        session: true,

        registrations: {
          include: {
            result: true,
          },
        },
      },
    });
  },

  /**
   * Create an exam.
   */
  async create(input: ExamInput) {
    const data = examSchema.parse(input);

    const session =
      await prisma.examSession.findUnique({
        where: {
          id: data.sessionId,
        },

        select: {
          id: true,
          schoolId: true,
          status: true,
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    const course =
      await prisma.course.findUnique({
        where: {
          id: data.courseId,
        },

        select: {
          id: true,
          schoolId: true,
        },
      });

    if (!course) {
      throw new Error(
        "Course not found.",
      );
    }

    if (course.schoolId !== session.schoolId) {
      throw new Error(
        "Course does not belong to the same school.",
      );
    }

    return prisma.exam.create({
      data: {
        sessionId: data.sessionId,
        courseId: data.courseId,

        name: data.name,

        code:
          data.code || null,

        type: data.type,

        maxMarks: data.maxMarks,
        passMarks: data.passMarks,

        examDate:
          data.examDate ?? null,

        startTime:
          data.startTime ?? null,

        endTime:
          data.endTime ?? null,

        venue:
          data.venue || null,

        instructions:
          data.instructions || null,
      },

      include: {
        course: true,
        session: true,
      },
    });
  },

  /**
   * Update an exam.
   */
  async update(
    id: string,
    input: ExamInput,
  ) {
    const data = examSchema.parse(input);

    const existing =
      await prisma.exam.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          sessionId: true,
        },
      });

    if (!existing) {
      throw new Error(
        "Exam not found.",
      );
    }

    if (
      existing.sessionId !==
      data.sessionId
    ) {
      throw new Error(
        "An exam cannot be moved to another session.",
      );
    }

    const course =
      await prisma.course.findUnique({
        where: {
          id: data.courseId,
        },

        select: {
          id: true,
          schoolId: true,
        },
      });

    if (!course) {
      throw new Error(
        "Course not found.",
      );
    }

    const session =
      await prisma.examSession.findUnique({
        where: {
          id: data.sessionId,
        },

        select: {
          schoolId: true,
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    if (course.schoolId !== session.schoolId) {
      throw new Error(
        "Course does not belong to the same school.",
      );
    }

    return prisma.exam.update({
      where: {
        id,
      },

      data: {
        courseId: data.courseId,

        name: data.name,

        code:
          data.code || null,

        type: data.type,

        maxMarks: data.maxMarks,
        passMarks: data.passMarks,

        examDate:
          data.examDate ?? null,

        startTime:
          data.startTime ?? null,

        endTime:
          data.endTime ?? null,

        venue:
          data.venue || null,

        instructions:
          data.instructions || null,
      },

      include: {
        course: true,
        session: true,
      },
    });
  },

  /**
   * Delete an exam only when nobody has
   * registered for it.
   */
  async delete(id: string) {
    const exam =
      await prisma.exam.findUnique({
        where: {
          id,
        },

        select: {
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      });

    if (!exam) {
      throw new Error(
        "Exam not found.",
      );
    }

    if (
      exam._count.registrations > 0
    ) {
      throw new Error(
        "An exam with registrations cannot be deleted.",
      );
    }

    return prisma.exam.delete({
      where: {
        id,
      },
    });
  },
};
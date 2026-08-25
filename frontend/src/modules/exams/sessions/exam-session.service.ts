import { z } from "zod";

import { prisma } from "@/lib/prisma";

import {
  examSessionSchema,
  type ExamSessionInput,
} from "./exam-session.schema";
export const examSessionService = {
  /**
   * Get all examination sessions for a school.
   */
  async getAll(schoolId: string) {
    return prisma.examSession.findMany({
      where: {
        schoolId,
      },
      include: {
        ruleSet: true,

        _count: {
          select: {
            exams: true,
            registrations: true,
            eligibilities: true,
            certificates: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get one examination session.
   */
  async getById(id: string) {
    return prisma.examSession.findUnique({
      where: {
        id,
      },

      include: {
        ruleSet: true,

        exams: {
          include: {
            course: true,
          },
          orderBy: {
            examDate: "asc",
          },
        },

        registrations: true,

        eligibilities: true,

        certificates: true,
      },
    });
  },

  /**
   * Create an examination session.
   *
   * The selected rule set becomes fixed to this
   * examination session.
   */
  async create(input: ExamSessionInput) {
    const data =
      examSessionSchema.parse(input);

    const ruleSet =
      await prisma.examRuleSet.findUnique({
        where: {
          id: data.ruleSetId,
        },

        select: {
          id: true,
          schoolId: true,
          version: true,
        },
      });

    if (!ruleSet) {
      throw new Error(
        "Examination rule set not found.",
      );
    }

    if (ruleSet.schoolId !== data.schoolId) {
      throw new Error(
        "Rule set does not belong to this school.",
      );
    }

    if (
      data.startsAt &&
      data.endsAt &&
      data.endsAt < data.startsAt
    ) {
      throw new Error(
        "Examination session end date cannot be before start date.",
      );
    }

    return prisma.examSession.create({
      data: {
        schoolId: data.schoolId,
        name: data.name,

        code:
          data.code || null,

        academicYear:
          data.academicYear || null,

        ruleSetId: data.ruleSetId,

        startsAt:
          data.startsAt ?? null,

        endsAt:
          data.endsAt ?? null,
      },

      include: {
        ruleSet: true,
      },
    });
  },

  /**
   * Update a session.
   *
   * The rule set is intentionally not changed here.
   * Once a session is created, its rules are fixed.
   */
  async update(
    id: string,
    input: Omit<
      ExamSessionInput,
      "schoolId" | "ruleSetId"
    >,
  ) {
    const data = z
      .object({
        name: z
          .string()
          .trim()
          .min(2),

        code: z
          .string()
          .trim()
          .optional()
          .or(z.literal("")),

        academicYear: z
          .string()
          .trim()
          .optional()
          .or(z.literal("")),

        startsAt:
          z.coerce.date().optional(),

        endsAt:
          z.coerce.date().optional(),
      })
      .parse(input);

    if (
      data.startsAt &&
      data.endsAt &&
      data.endsAt < data.startsAt
    ) {
      throw new Error(
        "Examination session end date cannot be before start date.",
      );
    }

    return prisma.examSession.update({
      where: {
        id,
      },

      data: {
        name: data.name,

        code:
          data.code || null,

        academicYear:
          data.academicYear || null,

        startsAt:
          data.startsAt ?? null,

        endsAt:
          data.endsAt ?? null,
      },

      include: {
        ruleSet: true,
      },
    });
  },

  /**
   * Delete a draft session.
   *
   * Published/active sessions should not be deleted
   * once examinations have been registered.
   */
  async delete(id: string) {
    const session =
      await prisma.examSession.findUnique({
        where: {
          id,
        },

        select: {
          status: true,

          _count: {
            select: {
              exams: true,
              registrations: true,
            },
          },
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    if (
      session._count.exams > 0 ||
      session._count.registrations > 0
    ) {
      throw new Error(
        "An examination session with exams or registrations cannot be deleted.",
      );
    }

    return prisma.examSession.delete({
      where: {
        id,
      },
    });
  },
};
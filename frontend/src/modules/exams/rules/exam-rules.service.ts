import { prisma } from "@/lib/prisma";

import {
  DEFAULT_EXAM_RULES,
  type ExamRules,
} from "./exam-rules";

import {
  examRulesSchema,
  type ExamRulesInput,
} from "./exam-rules.schema";

interface CreateExamRuleSetInput {
  schoolId: string;
  name: string;
  description?: string;
  rules?: ExamRulesInput;
  createdBy?: string;
}

interface UpdateExamRuleSetInput {
  name?: string;
  description?: string;
  rules?: ExamRulesInput;
}

/*
 * Prisma interactive transaction settings.
 *
 * maxWait:
 * How long Prisma waits to obtain a database transaction.
 *
 * timeout:
 * Maximum time the transaction itself may run.
 */
const TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 30_000,
};

export const examRulesService = {
  /**
   * Get the currently active rule set for a school.
   */
  async getActive(schoolId: string) {
    return prisma.examRuleSet.findFirst({
      where: {
        schoolId,
        isActive: true,
        OR: [
          {
            effectiveUntil: null,
          },
          {
            effectiveUntil: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        version: "desc",
      },
    });
  },

  /**
   * Get a specific rule set.
   */
  async getById(id: string) {
    return prisma.examRuleSet.findUnique({
      where: {
        id,
      },
    });
  },

  /**
   * Get all rule sets belonging to a school.
   */
  async getAll(schoolId: string) {
    return prisma.examRuleSet.findMany({
      where: {
        schoolId,
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          version: "desc",
        },
      ],
    });
  },

  /**
   * Create the first version of a rule set.
   */
  async create({
    schoolId,
    name,
    description,
    rules = DEFAULT_EXAM_RULES,
    createdBy,
  }: CreateExamRuleSetInput) {
    const validatedRules =
      examRulesSchema.parse(rules);

    return prisma.$transaction(
      async (tx) => {
        const latest =
          await tx.examRuleSet.findFirst({
            where: {
              schoolId,
              name,
            },
            orderBy: {
              version: "desc",
            },
            select: {
              version: true,
            },
          });

        const version =
          (latest?.version ?? 0) + 1;

        return tx.examRuleSet.create({
          data: {
            schoolId,
            name,
            description,
            version,
            rules: validatedRules,
            isActive: false,
            createdBy,
          },
        });
      },
      TRANSACTION_OPTIONS,
    );
  },

  /**
   * Create a new version of an existing rule set.
   *
   * Existing versions are preserved.
   */
  async createVersion(
    ruleSetId: string,
    rules: ExamRulesInput,
    createdBy?: string,
  ) {
    const validatedRules =
      examRulesSchema.parse(rules);

    return prisma.$transaction(
      async (tx) => {
        const current =
          await tx.examRuleSet.findUnique({
            where: {
              id: ruleSetId,
            },
          });

        if (!current) {
          throw new Error(
            "Examination rule set not found.",
          );
        }

        return tx.examRuleSet.create({
          data: {
            schoolId: current.schoolId,

            name: current.name,

            description:
              current.description,

            version:
              current.version + 1,

            rules: validatedRules,

            isActive: false,

            createdBy,
          },
        });
      },
      TRANSACTION_OPTIONS,
    );
  },

  /**
   * Activate one rule set version.
   *
   * The previous active version is closed
   * before the new version is activated.
   */
  async activate(id: string) {
    return prisma.$transaction(
      async (tx) => {
        const ruleSet =
          await tx.examRuleSet.findUnique({
            where: {
              id,
            },
          });

        if (!ruleSet) {
          throw new Error(
            "Examination rule set not found.",
          );
        }

        /*
         * Deactivate the previous active
         * version for this school.
         */
        await tx.examRuleSet.updateMany({
          where: {
            schoolId:
              ruleSet.schoolId,

            isActive: true,

            NOT: {
              id,
            },
          },

          data: {
            isActive: false,

            effectiveUntil:
              new Date(),
          },
        });

        /*
         * Activate the requested version.
         */
        return tx.examRuleSet.update({
          where: {
            id,
          },

          data: {
            isActive: true,

            effectiveFrom:
              new Date(),

            effectiveUntil: null,
          },
        });
      },
      TRANSACTION_OPTIONS,
    );
  },

  /**
   * Validate a rule object without saving it.
   */
  validateRules(
    rules: unknown,
  ): ExamRules {
    return examRulesSchema.parse(
      rules,
    );
  },

  /**
   * Update descriptive information only.
   *
   * Rule changes should always create
   * a new version.
   */
  async update(
    id: string,
    data: UpdateExamRuleSetInput,
  ) {
    const updateData: {
      name?: string;
      description?: string;
    } = {};

    if (data.name !== undefined) {
      updateData.name =
        data.name;
    }

    if (
      data.description !==
      undefined
    ) {
      updateData.description =
        data.description;
    }

    return prisma.examRuleSet.update({
      where: {
        id,
      },

      data: updateData,
    });
  },
};
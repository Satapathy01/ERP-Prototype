import { z } from "zod";

export const examRulesSchema = z.object({
  payment: z.object({
    required: z.boolean(),
    minimumCompletionPercentage: z
      .number()
      .min(0)
      .max(100),
  }),

  attendance: z.object({
    required: z.boolean(),

    minimumPercentage: z
      .number()
      .min(0)
      .max(100),

    scope: z.enum([
      "EVERY_COURSE",
      "OVERALL",
    ]),
  }),

  theory: z.object({
    required: z.boolean(),
    mustPass: z.boolean(),
  }),

  practical: z.object({
    required: z.boolean(),
    mustPass: z.boolean(),
  }),

  certificate: z.object({
    required: z.boolean(),

    fee: z
      .number()
      .min(0),
  }),
});

export type ExamRulesInput = z.infer<
  typeof examRulesSchema
>;
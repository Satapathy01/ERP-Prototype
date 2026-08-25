import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                         Campus Entry Schema                                */
/* -------------------------------------------------------------------------- */

export const campusEntrySchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(
      1,
      "Registration number is required.",
    )
    .max(
      100,
      "Registration number is too long.",
    ),

  deviceId: z
    .string()
    .trim()
    .max(100)
    .optional(),

  gateName: z
    .string()
    .trim()
    .max(100)
    .optional(),
});

export type CampusEntryInput =
  z.infer<typeof campusEntrySchema>;

/* -------------------------------------------------------------------------- */
/*                         Campus Scan Schema                                 */
/* -------------------------------------------------------------------------- */

export const campusScanSchema =
  z.object({
    registrationNumber: z
      .string()
      .trim()
      .min(
        1,
        "Registration number is required.",
      ),

    deviceId: z
      .string()
      .trim()
      .max(100)
      .optional(),

    gateName: z
      .string()
      .trim()
      .max(100)
      .optional(),
  });

export type CampusScanInput =
  z.infer<typeof campusScanSchema>;
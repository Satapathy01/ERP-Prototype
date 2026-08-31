import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                              Attendance Status                             */
/* -------------------------------------------------------------------------- */

export const attendanceStatusSchema = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
]);

/* -------------------------------------------------------------------------- */
/*                              Attendance Source                             */
/* -------------------------------------------------------------------------- */

export const attendanceSourceSchema = z.enum([
  "MANUAL",
  "CLASS",
  "CAMPUS_SCAN",
]);

/* -------------------------------------------------------------------------- */
/*                              Attendance Query                              */
/* -------------------------------------------------------------------------- */

export const attendanceQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(25),

  studentId: z.string().uuid().optional(),

  courseId: z.string().uuid().optional(),

  batchId: z.string().uuid().optional(),

  date: z.coerce.date().optional(),

  from: z.coerce.date().optional(),

  to: z.coerce.date().optional(),

  status: attendanceStatusSchema.optional(),

  source: attendanceSourceSchema.optional(),

  search: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                           Manual Attendance                                */
/* -------------------------------------------------------------------------- */

export const manualAttendanceItemSchema =
  z.object({
    studentId: z.string().uuid(),

    status: attendanceStatusSchema,

    remarks: z
      .string()
      .trim()
      .max(500)
      .optional(),
  });

export const manualAttendanceSchema =
  z.object({
    courseId: z.string().uuid(),

    batchId: z.string().uuid(),

    date: z.coerce.date(),

    records: z
      .array(manualAttendanceItemSchema)
      .min(1),
  });

/* -------------------------------------------------------------------------- */
/*                            Class Attendance                                */
/* -------------------------------------------------------------------------- */

export const classAttendanceSchema =
  z.object({
    courseId: z.string().uuid(),

    batchId: z.string().uuid(),

    sectionType: z.enum([
      "THEORY",
      "PRACTICAL",
    ]),

    date: z.coerce.date(),

    records: z
      .array(
        z.object({
          studentId: z.string().uuid(),

          status: attendanceStatusSchema,

          remarks: z
            .string()
            .trim()
            .max(500)
            .optional(),
        }),
      )
      .min(1),
  });

/* -------------------------------------------------------------------------- */
/*                              Campus Entry                                  */
/* -------------------------------------------------------------------------- */

export const campusEntrySchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required."),

  deviceId: z
    .string()
    .trim()
    .optional(),

  gateName: z
    .string()
    .trim()
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                                Types                                       */
/* -------------------------------------------------------------------------- */

export type AttendanceQuery = z.infer<
  typeof attendanceQuerySchema
>;

export type ManualAttendanceInput =
  z.infer<typeof manualAttendanceSchema>;

export type ClassAttendanceInput =
  z.infer<typeof classAttendanceSchema>;

export type CampusEntryInput =
  z.infer<typeof campusEntrySchema>;
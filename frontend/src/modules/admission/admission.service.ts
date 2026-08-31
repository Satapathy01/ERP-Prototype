import {
  Prisma,
  FeeType,
  PaymentStatus,
  InstallmentType,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateAdmissionBarcode } from "@/lib/barcode";
import { generateRegistrationNumber } from "@/lib/generate-registration-number";

import {
  CreateAdmissionInput,
  UpdateAdmissionInput,
} from "./admission.schema";

import {
  AdmissionDetails,
  AdmissionFilters,
  AdmissionListResult,
} from "./admission.types";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function decimal(value: number | string | Prisma.Decimal) {
  return new Prisma.Decimal(value);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);

  result.setMonth(result.getMonth() + months);

  return result;
}

function calculateCompletionDate(
  admissionDate: Date,
  durationMonths: number,
): Date {
  return addMonths(admissionDate, durationMonths);
}

/* -------------------------------------------------------------------------- */
/*                           Fee Ledger Generation                            */
/* -------------------------------------------------------------------------- */

type CourseForLedger = {
  admissionFee: Prisma.Decimal;
  monthlyFee: Prisma.Decimal;
  certificateFee: Prisma.Decimal;
  installmentCount: number;

  feeSchedules: {
    id: string;
    title: string;
    amount: Prisma.Decimal;
    isActive: boolean;
  }[];
};

/**
 * Builds the expected fee ledger entries for an admission.
 *
 * IMPORTANT:
 * - FeeSchedule is the master definition.
 * - FeeLedger is the admission-specific financial snapshot.
 * - Monthly installments intentionally share the same FeeSchedule
 *   but have different ledger titles/installment numbers.
 */
function buildFeeLedger(
  admissionId: string,
  course: CourseForLedger,
  admissionDate: Date,
): Prisma.FeeLedgerCreateManyInput[] {
  const ledger: Prisma.FeeLedgerCreateManyInput[] = [];

  /* ---------------------------------------------------------------------- */
  /* Admission Fee Schedule                                                 */
  /* ---------------------------------------------------------------------- */

  const admissionSchedule = course.feeSchedules.find(
    (schedule) =>
      schedule.title.trim().toLowerCase() === "admission fee" &&
      schedule.isActive,
  );

  if (!admissionSchedule) {
    throw new Error(
      'FeeSchedule "Admission Fee" not found for course.',
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Monthly Fee Schedule                                                   */
  /* ---------------------------------------------------------------------- */

  const monthlySchedule = course.feeSchedules.find(
    (schedule) =>
      schedule.title.trim().toLowerCase() === "monthly fee" &&
      schedule.isActive,
  );

  /* ---------------------------------------------------------------------- */
  /* Certificate Fee Schedule                                               */
  /* ---------------------------------------------------------------------- */

  const certificateSchedule = course.feeSchedules.find(
    (schedule) =>
      schedule.title.trim().toLowerCase() === "certificate fee" &&
      schedule.isActive,
  );

  /* ---------------------------------------------------------------------- */
  /* 1. Admission Fee                                                       */
  /* ---------------------------------------------------------------------- */

  ledger.push({
    admissionId,

    feeScheduleId: admissionSchedule.id,

    feeType: FeeType.ADMISSION,

    installmentNumber: 1,

    installmentType: null,

    title: "Admission Fee",

    amount: course.admissionFee,

    paidAmount: decimal(0),

    dueAmount: course.admissionFee,

    dueDate: admissionDate,

    status: PaymentStatus.PENDING,
  });

  /* ---------------------------------------------------------------------- */
  /* 2. Monthly Installments                                                */
  /* ---------------------------------------------------------------------- */

  if (course.installmentCount > 0) {
    if (!monthlySchedule) {
      throw new Error(
        'FeeSchedule "Monthly Fee" not found for course.',
      );
    }

    for (
      let i = 1;
      i <= course.installmentCount;
      i++
    ) {
      ledger.push({
        admissionId,

        feeScheduleId: monthlySchedule.id,

        feeType: FeeType.MONTHLY,

        installmentNumber: i,

        installmentType: InstallmentType.MONTHLY,

        title: `Month ${i}`,

        amount: course.monthlyFee,

        paidAmount: decimal(0),

        dueAmount: course.monthlyFee,

        dueDate: addMonths(admissionDate, i),

        status: PaymentStatus.PENDING,
      });
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 3. Certificate Fee                                                     */
  /* ---------------------------------------------------------------------- */

  if (Number(course.certificateFee) > 0) {
    if (!certificateSchedule) {
      throw new Error(
        'FeeSchedule "Certificate Fee" not found for course.',
      );
    }

    ledger.push({
      admissionId,

      feeScheduleId: certificateSchedule.id,

      feeType: FeeType.CERTIFICATE,

      installmentNumber:
        course.installmentCount + 1,

      installmentType: null,

      title: "Certificate Fee",

      amount: course.certificateFee,

      paidAmount: decimal(0),

      dueAmount: course.certificateFee,

      dueDate: addMonths(
        admissionDate,
        course.installmentCount,
      ),

      status: PaymentStatus.PENDING,
    });
  }

  return ledger;
}

/* -------------------------------------------------------------------------- */
/*                         Create Complete Fee Ledger                         */
/* -------------------------------------------------------------------------- */

async function generateFeeLedger(
  tx: Prisma.TransactionClient,
  admissionId: string,
  course: CourseForLedger,
  admissionDate: Date,
) {
  const ledger = buildFeeLedger(
    admissionId,
    course,
    admissionDate,
  );

  if (ledger.length === 0) {
    return;
  }

  await tx.feeLedger.createMany({
    data: ledger,
  });
}

/* -------------------------------------------------------------------------- */
/*                       Repair / Ensure Fee Ledger                           */
/* -------------------------------------------------------------------------- */

/**
 * Ensures an existing admission has all required ledger entries.
 *
 * This is important for admissions created before the current ledger
 * implementation existed.
 *
 * It does NOT blindly create duplicate rows.
 *
 * Existing ledger rows are preserved, including paid amounts.
 */
async function ensureFeeLedger(
  tx: Prisma.TransactionClient,
  admissionId: string,
  course: CourseForLedger,
  admissionDate: Date,
) {
  const expectedLedger = buildFeeLedger(
    admissionId,
    course,
    admissionDate,
  );

  if (expectedLedger.length === 0) {
    return;
  }

  const existingLedger = await tx.feeLedger.findMany({
    where: {
      admissionId,
    },
  });

  for (const expected of expectedLedger) {
    const existing = existingLedger.find(
      (entry) =>
        entry.feeScheduleId === expected.feeScheduleId &&
        entry.title === expected.title &&
        entry.installmentNumber ===
          expected.installmentNumber,
    );

    if (existing) {
      continue;
    }

    await tx.feeLedger.create({
      data: {
        admissionId:
          expected.admissionId,

        feeScheduleId:
          expected.feeScheduleId,

        feeType:
          expected.feeType,

        installmentNumber:
          expected.installmentNumber,

        installmentType:
          expected.installmentType,

        title:
          expected.title,

        amount:
          expected.amount,

        paidAmount:
          expected.paidAmount,

        dueAmount:
          expected.dueAmount,

        dueDate:
          expected.dueDate,

        status:
          expected.status,
      },
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                              Create Admission                              */
/* -------------------------------------------------------------------------- */

export async function createAdmission(
  schoolId: string,
  input: CreateAdmissionInput,
): Promise<AdmissionDetails> {
  return prisma.$transaction(async (tx) => {
    /* -------------------------------------------------------------------- */
    /* 1. Verify Student                                                    */
    /* -------------------------------------------------------------------- */

    const student = await tx.student.findFirst({
      where: {
        id: input.studentId,
        schoolId,
      },
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    /* -------------------------------------------------------------------- */
    /* 2. Verify Course                                                     */
    /* -------------------------------------------------------------------- */

    const course = await tx.course.findFirst({
      where: {
        id: input.courseId,
        schoolId,
        isActive: true,
      },

      include: {
        feeSchedules: {
          where: {
            isActive: true,
          },

          orderBy: {
            dueOrder: "asc",
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    /* -------------------------------------------------------------------- */
    /* 3. Prevent Duplicate Active Admission                                */
    /* -------------------------------------------------------------------- */

    const existingAdmission =
      await tx.admission.findFirst({
        where: {
          studentId: input.studentId,
          courseId: input.courseId,
          isActive: true,
        },
      });

    if (existingAdmission) {
      throw new Error(
        "Student already has an active admission for this course.",
      );
    }

    /* -------------------------------------------------------------------- */
    /* 4. Resolve Admission Date                                            */
    /* -------------------------------------------------------------------- */

    const admissionDate =
      input.admissionDate ?? new Date();

    /* -------------------------------------------------------------------- */
    /* 5. Generate Registration Number                                      */
    /* -------------------------------------------------------------------- */

    let registrationNumber =
      student.registrationNumber;

    if (!registrationNumber) {
      registrationNumber =
        await generateRegistrationNumber(
          tx,
          schoolId,
        );

      await tx.student.update({
        where: {
          id: student.id,
        },

        data: {
          registrationNumber,
        },
      });
    }

    /* -------------------------------------------------------------------- */
    /* 6. Generate Admission Barcode                                        */
    /* -------------------------------------------------------------------- */

    const barcode =
      generateAdmissionBarcode();

    /* -------------------------------------------------------------------- */
    /* 7. Calculate Completion Date                                         */
    /* -------------------------------------------------------------------- */

    const completionDate =
      input.expectedCompletionDate ??
      calculateCompletionDate(
        admissionDate,
        course.durationMonths,
      );

    /* -------------------------------------------------------------------- */
    /* 8. Create Admission                                                  */
    /* -------------------------------------------------------------------- */

    const admission =
      await tx.admission.create({
        data: {
          schoolId,

          studentId:
            input.studentId,

          courseId:
            input.courseId,

          /*
           * Preserve the selected batch when one is supplied.
           * If no batch was selected, keep the existing nullable
           * relation as null.
           */
          batchId:
            input.batchId ?? null,

          barcode,

          admissionDate,

          session:
            input.session || null,

          expectedCompletionDate:
            completionDate,

          /* Fee snapshot */
          admissionFee:
            decimal(course.admissionFee),

          monthlyFee:
            decimal(course.monthlyFee),

          certificateFee:
            decimal(course.certificateFee),

          totalFee:
            decimal(course.totalFee),

          discount:
            decimal(0),

          isActive:
            input.isActive,
        },
      });

    /* -------------------------------------------------------------------- */
    /* 9. Generate Fee Ledger                                               */
    /* -------------------------------------------------------------------- */

    await generateFeeLedger(
      tx,
      admission.id,
      course,
      admissionDate,
    );

    /*
     * Because this is inside the same transaction:
     *
     * Admission creation + FeeLedger creation
     *
     * either BOTH succeed or BOTH roll back.
     *
     * This prevents the original problem:
     *
     * Admission exists
     * FeeLedger does not exist
     */

    /* -------------------------------------------------------------------- */
    /* 10. Return Complete Admission                                        */
    /* -------------------------------------------------------------------- */

    return tx.admission.findUniqueOrThrow({
      where: {
        id: admission.id,
      },

      include: {
        school: true,

        student: true,

        course: true,

        feeLedger: {
          orderBy: {
            installmentNumber: "asc",
          },
        },

        feePayments: {
          orderBy: {
            receiptDate: "desc",
          },
        },
      },
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                              Get Admissions                                */
/* -------------------------------------------------------------------------- */

export async function getAdmissions(
  schoolId: string,
  filters: AdmissionFilters = {},
): Promise<AdmissionListResult> {
  const {
    search,
    studentId,
    courseId,
    session,
    batchName,
    trainerName,
    isActive,
    page = 1,
    limit = 10,
  } = filters;

  const where: Prisma.AdmissionWhereInput = {
    schoolId,
  };

  if (studentId) {
    where.studentId = studentId;
  }

  if (courseId) {
    where.courseId = courseId;
  }

  if (session) {
    where.session = {
      contains: session,
      mode: "insensitive",
    };
  }

  if (batchName) {
    where.batchName = {
      contains: batchName,
      mode: "insensitive",
    };
  }

  if (trainerName) {
    where.trainerName = {
      contains: trainerName,
      mode: "insensitive",
    };
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      {
        barcode: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        student: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },

      {
        student: {
          registrationNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      },

      {
        course: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [total, admissions] =
    await prisma.$transaction([
      prisma.admission.count({
        where,
      }),

      prisma.admission.findMany({
        where,

        include: {
          student: true,
          course: true,
        },

        orderBy: {
          admissionDate: "desc",
        },

        skip: (page - 1) * limit,

        take: limit,
      }),
    ]);

  return {
    admissions,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*                            Get Admission By ID                             */
/* -------------------------------------------------------------------------- */

export async function getAdmissionById(
  schoolId: string,
  admissionId: string,
): Promise<AdmissionDetails> {
  const admission =
    await prisma.admission.findFirst({
      where: {
        id: admissionId,
        schoolId,
      },

      include: {
        school: true,

        student: true,

        course: true,

        feeLedger: {
          orderBy: {
            installmentNumber: "asc",
          },
        },

        feePayments: {
          orderBy: {
            receiptDate: "desc",
          },
        },
      },
    });

  if (!admission) {
    throw new Error("Admission not found.");
  }

  return admission;
}

/* -------------------------------------------------------------------------- */
/*                             Update Admission                               */
/* -------------------------------------------------------------------------- */

export async function updateAdmission(
  schoolId: string,
  admissionId: string,
  input: UpdateAdmissionInput,
): Promise<AdmissionDetails> {
  return prisma.$transaction(async (tx) => {
    /* -------------------------------------------------------------------- */
    /* 1. Load Existing Admission                                           */
    /* -------------------------------------------------------------------- */

    const existingAdmission =
      await tx.admission.findFirst({
        where: {
          id: admissionId,
          schoolId,
        },

        include: {
          course: {
            include: {
              feeSchedules: {
                where: {
                  isActive: true,
                },

                orderBy: {
                  dueOrder: "asc",
                },
              },
            },
          },

          feeLedger: true,
        },
      });

    if (!existingAdmission) {
      throw new Error("Admission not found.");
    }

    /* -------------------------------------------------------------------- */
    /* 2. Resolve Course                                                     */
    /* -------------------------------------------------------------------- */

    let course = existingAdmission.course;

    const courseChanged =
      input.courseId !== undefined &&
      input.courseId !==
        existingAdmission.courseId;

    if (courseChanged) {
      const newCourse =
        await tx.course.findFirst({
          where: {
            id: input.courseId,
            schoolId,
            isActive: true,
          },

          include: {
            feeSchedules: {
              where: {
                isActive: true,
              },

              orderBy: {
                dueOrder: "asc",
              },
            },
          },
        });

      if (!newCourse) {
        throw new Error(
          "Selected course not found.",
        );
      }

      course = newCourse;
    }

    /* -------------------------------------------------------------------- */
    /* 3. Resolve Admission Date                                            */
    /* -------------------------------------------------------------------- */

    const admissionDate =
      input.admissionDate ??
      existingAdmission.admissionDate;

    /* -------------------------------------------------------------------- */
    /* 4. Calculate Completion Date                                         */
    /* -------------------------------------------------------------------- */

    const completionDate =
      input.expectedCompletionDate ??
      calculateCompletionDate(
        admissionDate,
        course.durationMonths,
      );

    /* -------------------------------------------------------------------- */
    /* 5. Update Admission                                                  */
    /* -------------------------------------------------------------------- */

    const updatedAdmission =
      await tx.admission.update({
        where: {
          id: admissionId,
        },

        data: {
          ...(input.courseId !== undefined
            ? {
                courseId:
                  input.courseId,
              }
            : {}),

          ...(input.batchId !== undefined
            ? {
                batchId:
                  input.batchId,
              }
            : {}),

          /*
           * Keep the existing admission date when
           * the edit form does not provide a new one.
           */
          admissionDate,

          ...(input.session !== undefined
            ? {
                session:
                  input.session,
              }
            : {}),

          expectedCompletionDate:
            completionDate,

          ...(input.admissionFee !== undefined
            ? {
                admissionFee:
                  decimal(
                    input.admissionFee,
                  ),
              }
            : {}),

          ...(input.isActive !== undefined
            ? {
                isActive:
                  input.isActive,
              }
            : {}),
        },
      });

    /* -------------------------------------------------------------------- */
    /* 6. Handle Fee Ledger                                                 */
    /* -------------------------------------------------------------------- */

    if (courseChanged) {
      /*
       * Course changed.
       *
       * The old ledger belongs to the old course's fee schedules,
       * so remove it and create a fresh ledger for the new course.
       */

      await tx.feeLedger.deleteMany({
        where: {
          admissionId,
        },
      });

      await generateFeeLedger(
        tx,
        admissionId,
        course,
        updatedAdmission.admissionDate,
      );
    } else {
      /*
       * Course did not change.
       *
       * DO NOT delete an existing ledger because it may contain
       * real payment history.
       *
       * Instead, repair missing entries only.
       *
       * This fixes legacy admissions where:
       *
       * Admission exists
       * FeeSchedule exists
       * FeeLedger = 0
       */

      await ensureFeeLedger(
        tx,
        admissionId,
        course,
        updatedAdmission.admissionDate,
      );
    }

    /* -------------------------------------------------------------------- */
    /* 7. Return Updated Admission                                          */
    /* -------------------------------------------------------------------- */

    return tx.admission.findUniqueOrThrow({
      where: {
        id: admissionId,
      },

      include: {
        school: true,

        student: true,

        course: true,

        feeLedger: {
          orderBy: {
            installmentNumber: "asc",
          },
        },

        feePayments: {
          orderBy: {
            receiptDate: "desc",
          },
        },
      },
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                              Delete Admission                              */
/* -------------------------------------------------------------------------- */

export async function deleteAdmission(
  schoolId: string,
  admissionId: string,
): Promise<void> {
  const admission =
    await prisma.admission.findFirst({
      where: {
        id: admissionId,
        schoolId,
      },

      select: {
        id: true,
        isActive: true,
      },
    });

  if (!admission) {
    throw new Error("Admission not found.");
  }

  if (!admission.isActive) {
    throw new Error(
      "Admission is already inactive.",
    );
  }

  await prisma.admission.update({
    where: {
      id: admissionId,
    },

    data: {
      isActive: false,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                             Restore Admission                              */
/* -------------------------------------------------------------------------- */

export async function restoreAdmission(
  schoolId: string,
  admissionId: string,
): Promise<void> {
  const admission =
    await prisma.admission.findFirst({
      where: {
        id: admissionId,
        schoolId,
      },

      select: {
        id: true,
        isActive: true,
      },
    });

  if (!admission) {
    throw new Error("Admission not found.");
  }

  if (admission.isActive) {
    throw new Error(
      "Admission is already active.",
    );
  }

  await prisma.admission.update({
    where: {
      id: admissionId,
    },

    data: {
      isActive: true,
    },
  });
}
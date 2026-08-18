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
  durationMonths: number
): Date {
  return addMonths(admissionDate, durationMonths);
}

async function generateFeeLedger(
  tx: Prisma.TransactionClient,
  admissionId: string,
  course: {
    admissionFee: Prisma.Decimal;
    monthlyFee: Prisma.Decimal;
    certificateFee: Prisma.Decimal;
    installmentCount: number;
  },
  admissionDate: Date
) {
  const ledger: Prisma.FeeLedgerCreateManyInput[] = [];

  // ==================================================
  // 1. ADMISSION FEE
  // ==================================================

  ledger.push({
    admissionId,
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

  // ==================================================
  // 2. MONTHLY INSTALLMENTS
  // ==================================================

  for (
    let i = 1;
    i <= course.installmentCount;
    i++
  ) {
    ledger.push({
      admissionId,
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

  // ==================================================
  // 3. CERTIFICATE FEE
  // ==================================================

  if (Number(course.certificateFee) > 0) {
    ledger.push({
      admissionId,
      feeType: FeeType.CERTIFICATE,
      installmentNumber: course.installmentCount + 1,
      installmentType: null,
      title: "Certificate Fee",
      amount: course.certificateFee,
      paidAmount: decimal(0),
      dueAmount: course.certificateFee,
      dueDate: addMonths(
        admissionDate,
        course.installmentCount
      ),
      status: PaymentStatus.PENDING,
    });
  }

  // ==================================================
  // 4. SAVE LEDGER
  // ==================================================

  await tx.feeLedger.createMany({
    data: ledger,
  });
}

// ======================================================
// CREATE ADMISSION
// ======================================================

export async function createAdmission(
  schoolId: string,
  input: CreateAdmissionInput
): Promise<AdmissionDetails> {
  return prisma.$transaction(async (tx) => {
    // ==================================================
    // 1. VERIFY STUDENT
    // ==================================================

    const student = await tx.student.findFirst({
      where: {
        id: input.studentId,
        schoolId,
      },
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    // ==================================================
    // 2. VERIFY COURSE
    // ==================================================

    const course = await tx.course.findFirst({
      where: {
        id: input.courseId,
        schoolId,
        isActive: true,
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    // ==================================================
    // 3. PREVENT DUPLICATE ACTIVE ADMISSION
    // ==================================================

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
        "Student already has an active admission for this course."
      );
    }

    // ==================================================
    // 4. GENERATE REGISTRATION NUMBER IF MISSING
    // ==================================================

    let registrationNumber =
      student.registrationNumber;

    if (!registrationNumber) {
      registrationNumber =
        await generateRegistrationNumber(
          tx,
          schoolId
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

    // ==================================================
    // 5. GENERATE BARCODE
    // ==================================================

    const barcode = generateAdmissionBarcode();

    // ==================================================
    // 6. CALCULATE COMPLETION DATE
    // ==================================================

    const completionDate =
      input.expectedCompletionDate ??
      calculateCompletionDate(
        input.admissionDate,
        course.durationMonths
      );

    // ==================================================
    // 7. CREATE ADMISSION
    // ==================================================

    const admission =
      await tx.admission.create({
        data: {
          schoolId,
          studentId: input.studentId,
          courseId: input.courseId,

          barcode,

          admissionDate: input.admissionDate,

          session: input.session || null,

          expectedCompletionDate:
            completionDate,

          // Fee snapshot
          admissionFee: decimal(
            course.admissionFee
          ),

          monthlyFee: decimal(
            course.monthlyFee
          ),

          certificateFee: decimal(
            course.certificateFee
          ),

          totalFee: decimal(
            course.totalFee
          ),

          discount: decimal(0),

          isActive: input.isActive,
        },
      });

    // ==================================================
    // 8. GENERATE FEE LEDGER
    // ==================================================

    await generateFeeLedger(
      tx,
      admission.id,
      course,
      input.admissionDate
    );

    // ==================================================
    // 9. RETURN COMPLETE ADMISSION
    // ==================================================

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

// ======================================================
// GET ADMISSIONS
// ======================================================

export async function getAdmissions(
  schoolId: string,
  filters: AdmissionFilters = {}
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
    totalPages: Math.ceil(total / limit),
  };
}

// ======================================================
// GET ADMISSION BY ID
// ======================================================

export async function getAdmissionById(
  schoolId: string,
  admissionId: string
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

// ======================================================
// UPDATE ADMISSION
// ======================================================

export async function updateAdmission(
  schoolId: string,
  admissionId: string,
  input: UpdateAdmissionInput
): Promise<AdmissionDetails> {
  return prisma.$transaction(async (tx) => {
    const existingAdmission =
      await tx.admission.findFirst({
        where: {
          id: admissionId,
          schoolId,
        },

        include: {
          course: true,
        },
      });

    if (!existingAdmission) {
      throw new Error("Admission not found.");
    }

    let course = existingAdmission.course;

    // ==================================================
    // LOAD NEW COURSE IF COURSE CHANGED
    // ==================================================

    if (
      input.courseId &&
      input.courseId !== existingAdmission.courseId
    ) {
      const newCourse =
        await tx.course.findFirst({
          where: {
            id: input.courseId,
            schoolId,
            isActive: true,
          },
        });

      if (!newCourse) {
        throw new Error(
          "Selected course not found."
        );
      }

      course = newCourse;
    }

    // ==================================================
    // CALCULATE COMPLETION DATE
    // ==================================================

    const completionDate =
      input.expectedCompletionDate ??
      calculateCompletionDate(
        input.admissionDate ??
          existingAdmission.admissionDate,
        course.durationMonths
      );

    // ==================================================
    // UPDATE ADMISSION
    // ==================================================

    const updatedAdmission =
      await tx.admission.update({
        where: {
          id: admissionId,
        },

        data: {
          courseId: input.courseId,

          admissionDate: input.admissionDate,

          session: input.session,

          expectedCompletionDate:
            completionDate,

          admissionFee:
            input.admissionFee !== undefined
              ? decimal(input.admissionFee)
              : undefined,

          isActive: input.isActive,
        },
      });

    // ==================================================
    // REGENERATE FEE LEDGER IF COURSE CHANGED
    // ==================================================

    if (
      input.courseId &&
      input.courseId !==
        existingAdmission.courseId
    ) {
      await tx.feeLedger.deleteMany({
        where: {
          admissionId,
        },
      });

      await generateFeeLedger(
        tx,
        admissionId,
        course,
        updatedAdmission.admissionDate
      );
    }

    // ==================================================
    // RETURN UPDATED ADMISSION
    // ==================================================

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

// ======================================================
// DELETE ADMISSION
// ======================================================

export async function deleteAdmission(
  schoolId: string,
  admissionId: string
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
      "Admission is already inactive."
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

// ======================================================
// RESTORE ADMISSION
// ======================================================

export async function restoreAdmission(
  schoolId: string,
  admissionId: string
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
      "Admission is already active."
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
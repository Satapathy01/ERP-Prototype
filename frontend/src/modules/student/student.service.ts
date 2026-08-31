import { prisma } from "~/lib/prisma";
import { generateRegistrationNumber } from "~/lib/generate-registration-number";

import type { CreateStudentInput } from "./student.schema";

interface GetStudentsOptions {
  schoolId: string;

  page?: number;
  pageSize?: number;
  search?: string;
}
export async function getStudents({
  schoolId,
  page = 1,
  pageSize = 20,
  search = "",
}: GetStudentsOptions) {
  const where = {
    schoolId,

    ...(search
      ? {
          OR: [
            {
              registrationNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              fatherName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              motherName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              studentPhone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const total = await prisma.student.count({
    where,
  });

  const students = await prisma.student.findMany({
    where,

    include: {
      admissions: {
        include: {
          course: true,
          batch: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * pageSize,

    take: pageSize,
  });

  return {
    students,
    total,

    currentPage: page,
    pageSize,

    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: {
      id,
    },

    include: {
      admissions: {
        include: {
          course: true,
          batch: true,

          feePayments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      importRows: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function createStudent(
  schoolId: string,
  data: CreateStudentInput
)
  {
  if (!data.courseId) {
    throw new Error("Please select a course.");
  }
  return prisma.$transaction(
    async (tx) => {
    // --------------------------------------------------
    // Find selected course
    // --------------------------------------------------

    const course = await tx.course.findFirst({
      where: {
        id: data.courseId,
        schoolId,
        isActive: true,
      },
    });

    if (!course) {
      throw new Error(
        "Selected course was not found or is inactive."
      );
    }

    // --------------------------------------------------
    // Generate registration number
    // --------------------------------------------------

    const registrationNumber =
      await generateRegistrationNumber(tx, schoolId);

    // --------------------------------------------------
    // Create student
    // --------------------------------------------------

    const student = await tx.student.create({
      data: {
        schoolId,

        registrationNumber,

        name: data.name,

        fatherName: data.fatherName || null,
        motherName: data.motherName || null,

        gender: data.gender || null,

        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null,

        bloodGroup: data.bloodGroup || null,

        studentPhone: data.studentPhone || null,
        parentPhone: data.parentPhone || null,

        email: data.email || null,

        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pinCode: data.pinCode || null,

        aadhaarNumber: data.aadhaarNumber || null,

        photoUrl: data.photoUrl || null,

        status: data.status,
      },
    });

    // --------------------------------------------------
    // Create Admission
    // --------------------------------------------------

    const admission = await tx.admission.create({
      data: {
        schoolId,

        studentId: student.id,

        courseId: course.id,

        batchId: null,

        barcode: `ADM-${registrationNumber}-${Date.now()}`,

        admissionDate: new Date(),

        session: null,

        batchName: null,

        trainerName: null,

        // Copy course fee structure
        admissionFee: course.admissionFee,

        monthlyFee: course.monthlyFee,

        certificateFee: course.certificateFee,

        totalFee: course.totalFee,

        discount: 0,

        expectedCompletionDate: null,

        isActive: true,
      },
    });

    // --------------------------------------------------
    // Return student + admission + course
    // --------------------------------------------------

    return {
      ...student,
      admission,
      course,
    };
   },
    {
      // Give Prisma more time to obtain a connection
      // before giving up on starting the transaction.
      maxWait: 10000,

      // Give the transaction more time to finish.
      timeout: 20000,
    }
  );
}

export async function updateStudent(
  id: string,
  schoolId: string,
  data: CreateStudentInput
) {
  return prisma.student.update({
    where: {
      id,
    },

    data: {
      name: data.name,

      fatherName: data.fatherName ?? null,
      motherName: data.motherName ?? null,

      gender: data.gender ?? null,

      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : null,

      bloodGroup: data.bloodGroup ?? null,

      studentPhone: data.studentPhone ?? null,
      parentPhone: data.parentPhone ?? null,

      email: data.email ?? null,

      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      pinCode: data.pinCode ?? null,

      aadhaarNumber: data.aadhaarNumber ?? null,

      photoUrl: data.photoUrl ?? null,

      status: data.status,
    },
  });
}

export async function deleteStudent(
  id: string,
  schoolId: string
) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findFirst({
      where: {
        id,
        schoolId,
      },

      include: {
        admissions: {
          include: {
            feePayments: true,
          },
        },
      },
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    // Delete Fee Payments
    for (const admission of student.admissions) {
      await tx.feePayment.deleteMany({
        where: {
          admissionId: admission.id,
        },
      });
    }

    // Delete Admissions
    await tx.admission.deleteMany({
      where: {
        studentId: id,
      },
    });

    // Delete Import Rows
    await tx.importRow.deleteMany({
      where: {
        studentId: id,
      },
    });

    // Delete Student
    return tx.student.delete({
      where: {
        id,
      },
    });
  });
}

export async function deleteManyStudents(
  ids: string[],
  schoolId: string,
) {
  return prisma.$transaction(async (tx) => {
    let deletedCount = 0;

    for (const id of ids) {
      // Find the student belonging to this school
      const student = await tx.student.findFirst({
        where: {
          id,
          schoolId,
        },
        include: {
          admissions: true,
        },
      });

      // Student doesn't exist or belongs to another school
      if (!student) {
        continue;
      }

      // --------------------------------------------------
      // 1. Delete fee payments
      // --------------------------------------------------

      for (const admission of student.admissions) {
        await tx.feePayment.deleteMany({
          where: {
            admissionId: admission.id,
          },
        });
      }

      // --------------------------------------------------
      // 2. Delete admissions
      // --------------------------------------------------

      await tx.admission.deleteMany({
        where: {
          studentId: id,
        },
      });

      // --------------------------------------------------
      // 3. Delete import rows
      // --------------------------------------------------

      await tx.importRow.deleteMany({
        where: {
          studentId: id,
        },
      });

      // --------------------------------------------------
      // 4. Delete student
      // --------------------------------------------------

      await tx.student.delete({
        where: {
          id,
        },
      });

      deletedCount++;
    }

    // Return result to the server action
    return {
      count: deletedCount,
    };
  });
}
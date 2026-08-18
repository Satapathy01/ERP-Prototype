import { randomUUID } from "crypto";

import { Gender, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildImportPreview } from "@/modules/import/engine/importer";

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function parseGender(
  value: string | null | undefined
): Gender | null {
  if (!value) return null;

  switch (value.trim().toUpperCase()) {
    case "MALE":
    case "M":
      return Gender.MALE;

    case "FEMALE":
    case "F":
      return Gender.FEMALE;

    case "OTHER":
    case "O":
      return Gender.OTHER;

    default:
      return null;
  }
}

// -------------------------------------------------------
// Types
// -------------------------------------------------------

export interface ImportSummary {
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: {
    row: number;
    errors: string[];
  }[];
}

// -------------------------------------------------------
// Import Students
// -------------------------------------------------------

export async function importStudents(
  buffer: Buffer,
  schoolId: string,
  importedById: string,
  fileName: string
): Promise<ImportSummary> {
  //-------------------------------------------------------
  // Create Import Job
  //-------------------------------------------------------

  const job = await prisma.importJob.create({
    data: {
      schoolId,
      importedById,
      fileName,
      status: "PROCESSING",
    },
  });

  //-------------------------------------------------------
  // Build Preview
  //-------------------------------------------------------

  const preview = await buildImportPreview(
    buffer,
    schoolId
  );

  //-------------------------------------------------------
  // Cache Active Courses
  //-------------------------------------------------------

  const courses = await prisma.course.findMany({
    where: {
      schoolId,
      isActive: true,
    },
  });

  const courseMap = new Map(
    courses.map((course) => [course.code, course])
  );

  //-------------------------------------------------------
  // Summary Variables
  //-------------------------------------------------------

  let importedRows = 0;

  const errors: ImportSummary["errors"] = [];

  //-------------------------------------------------------
  // Process Rows
  //-------------------------------------------------------

  for (const row of preview.rows) {
    //-----------------------------------------------------
    // Skip Invalid Rows
    //-----------------------------------------------------

    if (!row.validation.valid) {
      errors.push({
        row: row.rowNumber,
        errors: row.validation.errors.map(
          (error) => error.message
        ),
      });

      await prisma.importRow.create({
        data: {
          importJobId: job.id,
          rowNumber: row.rowNumber,
          status: "FAILED",
          errorMessage: row.validation.errors
            .map((error) => error.message)
            .join(", "),
          rawData: row.raw,
        },
      });

      continue;
    }

    //-----------------------------------------------------
    // Import Transaction
    //-----------------------------------------------------

    try {
      await prisma.$transaction(async (tx) => {
        const data = row.mapped;

        const registrationNumber =
          data.student.registrationNumber?.trim() ?? "";

        const studentName =
          data.student.name?.trim() ?? "";

        const gender = parseGender(
          data.student.gender
        );

        if (!registrationNumber) {
          throw new Error(
            `Registration Number missing (Row ${row.rowNumber})`
          );
        }

        if (!studentName) {
          throw new Error(
            `Student Name missing (Row ${row.rowNumber})`
          );
        }

        //-------------------------------------------------
        // Debug Logging
        //-------------------------------------------------

        console.log("====================================");
        console.log("Import Row:", row.rowNumber);

        console.dir(data, {
          depth: null,
        });

        // ===========================================
        // PART 2 STARTS HERE
        // Student Upsert
                //-------------------------------------------------
        // Find Course
        //-------------------------------------------------

        const courseCode = data.admission.course?.trim() ?? "";

let course = courseMap.get(courseCode);

if (!course) {
  course = await tx.course.create({
    data: {
      schoolId,
      code: courseCode,
      name: courseCode,
      admissionFee: 0,
      isActive: true,
    },
  });

  courseMap.set(courseCode, course);
}

        //-------------------------------------------------
        // Student Upsert
        //-------------------------------------------------

        const student = await tx.student.upsert({
          where: {
            schoolId_registrationNumber: {
              schoolId,
              registrationNumber,
            },
          },

          update: {
            name: studentName,

            fatherName:
              data.student.fatherName ?? null,

            motherName:
              data.student.motherName ?? null,

            gender,

            dateOfBirth:
              data.student.dateOfBirth ?? null,

            

            email:
              data.student.email ?? null,

            address:
              data.student.address ?? null,

            city:
              data.student.city ?? null,

            state:
              data.student.state ?? null,

            pinCode:
              data.student.pinCode ?? null,

            aadhaarNumber:
              data.student.aadhaarNumber ?? null,

            status: "ACTIVE",
          },

          create: {
            schoolId,

            registrationNumber,

            name: studentName,

            fatherName:
              data.student.fatherName ?? null,

            motherName:
              data.student.motherName ?? null,

            gender,

            dateOfBirth:
              data.student.dateOfBirth ?? null,

            

            email:
              data.student.email ?? null,

            address:
              data.student.address ?? null,

            city:
              data.student.city ?? null,

            state:
              data.student.state ?? null,

            pinCode:
              data.student.pinCode ?? null,

            aadhaarNumber:
              data.student.aadhaarNumber ?? null,

            status: "ACTIVE",
          },
        });

        //-------------------------------------------------
        // Check Existing Admission
        //-------------------------------------------------

        const existingAdmission =
          await tx.admission.findFirst({
            where: {
              studentId: student.id,
              courseId: course.id,
            },
          });

        if (existingAdmission) {
          throw new Error(
            "Student already admitted to this course."
          );
        }

        //-------------------------------------------------
        // Create Admission
        //-------------------------------------------------

        const admission =
          await tx.admission.create({
            data: {
              schoolId,

              studentId: student.id,

              courseId: course.id,

              barcode: randomUUID(),

              admissionDate:
                data.admission.admissionDate ??
                new Date(),

              admissionFee:
                course.admissionFee,
            },
          });

        //-------------------------------------------------
        // Create Fee Payment
        //-------------------------------------------------

        if (
          data.payment.amountPaid !== undefined &&
          data.payment.amountPaid > 0
        ) {
          await tx.feePayment.create({
            data: {
              admissionId: admission.id,

              amountPaid: new Prisma.Decimal(
                data.payment.amountPaid
              ),

              mrNumber:
                data.payment.mrNumber ?? null,

              receiptDate:
                data.payment.receiptDate ?? null,

              status: "PAID",
            },
          });
        }

        //-------------------------------------------------
        // Log Import Success
        //-------------------------------------------------

        await tx.importRow.create({
          data: {
            importJobId: job.id,

            studentId: student.id,

            rowNumber: row.rowNumber,

            status: "SUCCESS",

            rawData: row.raw,
          },
        });
                //-------------------------------------------------
        // Increment Success Count
        //-------------------------------------------------

      });

      importedRows++;

    } catch (err: unknown) {

      console.error(
        "========================================"
      );

      console.error(
        `Import failed at row ${row.rowNumber}`
      );

      console.dir(err, {
        depth: null,
      });

      if (
        err instanceof Prisma.PrismaClientKnownRequestError
      ) {
        console.error(
          "Prisma Code:",
          err.code
        );

        console.error(
          "Prisma Meta:",
          err.meta
        );
      }

      const message =
        err instanceof Error
          ? err.message
          : "Unknown import error.";

      errors.push({
        row: row.rowNumber,
        errors: [message],
      });

      await prisma.importRow.create({
        data: {
          importJobId: job.id,

          rowNumber: row.rowNumber,

          status: "FAILED",

          errorMessage: message,

          rawData: row.raw,
        },
      });
    }
  }

  //-------------------------------------------------------
  // Complete Import Job
  //-------------------------------------------------------

  await prisma.importJob.update({
    where: {
      id: job.id,
    },

    data: {
      status: "COMPLETED",

      totalRows: preview.totalRows,

      successRows: importedRows,

      failedRows: errors.length,

      completedAt: new Date(),
    },
  });

  //-------------------------------------------------------
  // Return Summary
  //-------------------------------------------------------

  return {
    totalRows: preview.totalRows,

    importedRows,

    failedRows: errors.length,

    errors,
  };
}

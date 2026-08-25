import { prisma } from "@/lib/prisma";

import {
  createCertificateSchema,
  certificateStatusSchema,
  type CreateCertificateInput,
  type CertificateStatusInput,
} from "./certificate.schema";

import {
  createPayment,
} from "@/modules/finance/services/finance.service";

interface CreateCertificateOptions {
  createdBy?: string;
}

export const certificateService = {
  /* --------------------------------------------------
   * Get certificates
   * -------------------------------------------------- */

  async getByStudent(studentId: string) {
    return prisma.certificate.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getBySession(sessionId: string) {
    return prisma.certificate.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getById(id: string) {
    return prisma.certificate.findUnique({
      where: {
        id,
      },
    });
  },

  /* --------------------------------------------------
   * Create certificate
   * -------------------------------------------------- */

  async create(
    input: CreateCertificateInput,
    options?: CreateCertificateOptions,
  ) {
    const data =
      createCertificateSchema.parse(input);

    /*
     * Verify student.
     */
    const student =
      await prisma.student.findUnique({
        where: {
          id: data.studentId,
        },

        select: {
          id: true,
          schoolId: true,
        },
      });

    if (!student) {
      throw new Error(
        "Student not found.",
      );
    }

    /*
     * Verify examination session.
     */
    const session =
      await prisma.examSession.findUnique({
        where: {
          id: data.sessionId,
        },

        select: {
          id: true,
          schoolId: true,
        },
      });

    if (!session) {
      throw new Error(
        "Examination session not found.",
      );
    }

    if (
      session.schoolId !==
      student.schoolId
    ) {
      throw new Error(
        "Student and examination session do not belong to the same school.",
      );
    }

    /*
     * Verify graduation before creating
     * the certificate.
     */
    const eligibility =
      await prisma.examEligibility.findFirst({
        where: {
          sessionId: data.sessionId,
          studentId: data.studentId,
        },

        orderBy: {
          evaluatedAt: "desc",
        },
      });

    if (!eligibility) {
      throw new Error(
        "Student examination eligibility has not been evaluated.",
      );
    }

    if (
      eligibility.status !==
      "ELIGIBLE"
    ) {
      throw new Error(
        "Student is not eligible for examination completion.",
      );
    }

    /*
     * If admissionId was supplied, verify it.
     */
    let admissionId =
      data.admissionId || null;

    if (admissionId) {
      const admission =
        await prisma.admission.findFirst({
          where: {
            id: admissionId,
            studentId: data.studentId,
            schoolId: student.schoolId,
          },

          select: {
            id: true,
          },
        });

      if (!admission) {
        throw new Error(
          "Admission does not belong to this student.",
        );
      }
    }

    /*
     * If admissionId wasn't supplied,
     * try to resolve the active admission.
     */
    if (!admissionId) {
      const admission =
        await prisma.admission.findFirst({
          where: {
            studentId: data.studentId,
            schoolId: student.schoolId,
            isActive: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
          },
        });

      admissionId =
        admission?.id ?? null;
    }

    if (!admissionId) {
      throw new Error(
        "An active admission is required to create a certificate.",
      );
    }

    /*
     * Prevent duplicate certificate numbers.
     */
    const existing =
      await prisma.certificate.findUnique({
        where: {
          certificateNumber:
            data.certificateNumber,
        },
      });

    if (existing) {
      throw new Error(
        "Certificate number already exists.",
      );
    }

    /*
     * Prevent multiple active certificates
     * for the same student/session.
     */
    const existingCertificate =
      await prisma.certificate.findFirst({
        where: {
          studentId: data.studentId,
          sessionId: data.sessionId,

          status: {
            not: "CANCELLED",
          },
        },
      });

    if (existingCertificate) {
      throw new Error(
        "A certificate already exists for this student and examination session.",
      );
    }

    return prisma.certificate.create({
      data: {
        schoolId:
          student.schoolId,

        studentId:
          data.studentId,

        admissionId,

        sessionId:
          data.sessionId,

        certificateNumber:
          data.certificateNumber,

        certificateType:
          data.certificateType,

        certificateFee:
          data.certificateFee,

        status:
          "CREATED",

        createdBy:
          options?.createdBy ?? null,
      },
    });
  },

  /* --------------------------------------------------
   * Attach existing payment
   * -------------------------------------------------- */

  async attachPayment(
    certificateId: string,
    paymentId: string,
  ) {
    const certificate =
      await prisma.certificate.findUnique({
        where: {
          id: certificateId,
        },
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found.",
      );
    }

    if (
      certificate.status ===
      "CANCELLED"
    ) {
      throw new Error(
        "A cancelled certificate cannot receive payment.",
      );
    }

    if (certificate.paymentId) {
      throw new Error(
        "A payment is already attached to this certificate.",
      );
    }

    const payment =
      await prisma.feePayment.findUnique({
        where: {
          id: paymentId,
        },

        select: {
          id: true,
          admissionId: true,
          amountPaid: true,
          status: true,
        },
      });

    if (!payment) {
      throw new Error(
        "Payment not found.",
      );
    }

    if (
      payment.admissionId !==
      certificate.admissionId
    ) {
      throw new Error(
        "Payment does not belong to the certificate admission.",
      );
    }

    if (
      Number(payment.amountPaid) <
      Number(certificate.certificateFee)
    ) {
      throw new Error(
        "Certificate payment amount is insufficient.",
      );
    }

    if (payment.status !== "PAID") {
      throw new Error(
        "Certificate payment must be marked as PAID.",
      );
    }

    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        paymentId,
      },
    });
  },

  /* --------------------------------------------------
   * Create certificate payment
   * -------------------------------------------------- */

  async createPayment(
    certificateId: string,
    input: {
      paymentMethod?:
        | "CASH"
        | "UPI"
        | "CARD"
        | "BANK_TRANSFER"
        | "CHEQUE"
        | "ONLINE";

      transactionId?: string;

      collectedBy?: string;

      remarks?: string;
    },
  ) {
    const certificate =
      await prisma.certificate.findUnique({
        where: {
          id: certificateId,
        },

        include: {
          session: true,

          student: true,

          admission: {
            include: {
              course: {
                include: {
                  feeSchedules: true,
                },
              },
            },
          },
        },
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found.",
      );
    }

    if (
      certificate.status ===
      "CANCELLED"
    ) {
      throw new Error(
        "Cancelled certificate cannot be paid.",
      );
    }

    if (
      certificate.paymentId
    ) {
      throw new Error(
        "Certificate payment has already been created.",
      );
    }

    if (!certificate.admission) {
      throw new Error(
        "Certificate admission not found.",
      );
    }

    /*
     * Find the course-specific certificate
     * fee schedule.
     */
    let certificateSchedule =
      certificate.admission.course.feeSchedules.find(
        (schedule) =>
          schedule.title
            .trim()
            .toLowerCase() ===
          "certificate fee" &&
          schedule.isActive,
      );

    /*
     * Create the schedule if it does not
     * exist yet.
     */
    if (!certificateSchedule) {
      certificateSchedule =
        await prisma.feeSchedule.create({
          data: {
            schoolId:
              certificate.schoolId,

            courseId:
              certificate.admission
                .courseId,

            title:
              "Certificate Fee",

            amount:
              certificate.certificateFee,

            /*
             * Certificate fee is normally
             * paid at the end of the course
             * installment ordering.
             */
            dueOrder: 999,

            isMandatory: false,

            isActive: true,
          },
        });
    }

    /*
     * Make sure the schedule amount matches
     * the certificate amount.
     */
    if (
      Number(
        certificateSchedule.amount,
      ) !==
      Number(
        certificate.certificateFee,
      )
    ) {
      throw new Error(
        "Certificate fee schedule amount does not match the certificate fee.",
      );
    }

    /*
     * Use the existing Finance service.
     */
    const payment =
      await createPayment(
        certificate.schoolId,
        {
          admissionId:
            certificate.admissionId!,

          receiptDate:
            new Date(),

          amountPaid:
            Number(
              certificate.certificateFee,
            ),

          status: "PAID",

          paymentMethod:
            input.paymentMethod ??
            "CASH",

          transactionId:
            input.transactionId,

          remarks:
            input.remarks ??
            `Certificate fee - ${certificate.certificateNumber}`,

          collectedBy:
            input.collectedBy,

          paymentItems: [
            {
              feeScheduleId:
                certificateSchedule.id,

              title:
                "Certificate Fee",

              amount:
                Number(
                  certificate.certificateFee,
                ),
            },
          ],
        },
      );

    /*
     * Attach payment to certificate.
     */
    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        paymentId:
          payment.id,
      },

      include: {
        session: true,
      },
    });
  },

  /* --------------------------------------------------
   * Mark ready
   * -------------------------------------------------- */

  async markReady(
    certificateId: string,
  ) {
    const certificate =
      await prisma.certificate.findUnique({
        where: {
          id: certificateId,
        },
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found.",
      );
    }

    if (
      certificate.status !==
      "CREATED"
    ) {
      throw new Error(
        "Only a created certificate can be marked ready.",
      );
    }

    if (!certificate.paymentId) {
      throw new Error(
        "Certificate payment is required before marking the certificate ready.",
      );
    }

    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        status:
          "READY_FOR_COLLECTION",

        readyAt:
          new Date(),
      },
    });
  },

  /* --------------------------------------------------
   * Issue
   * -------------------------------------------------- */

  async issue(
    certificateId: string,
    issuedBy?: string,
  ) {
    const certificate =
      await prisma.certificate.findUnique({
        where: {
          id: certificateId,
        },
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found.",
      );
    }

    if (
      certificate.status !==
      "READY_FOR_COLLECTION"
    ) {
      throw new Error(
        "Certificate must be ready for collection before it can be issued.",
      );
    }

    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        status: "ISSUED",

        issuedAt:
          new Date(),

        issuedBy:
          issuedBy ?? null,
      },
    });
  },

  /* --------------------------------------------------
   * Cancel
   * -------------------------------------------------- */

  async cancel(
    certificateId: string,
    reason: string,
    cancelledBy?: string,
  ) {
    if (!reason.trim()) {
      throw new Error(
        "Cancellation reason is required.",
      );
    }

    const certificate =
      await prisma.certificate.findUnique({
        where: {
          id: certificateId,
        },
      });

    if (!certificate) {
      throw new Error(
        "Certificate not found.",
      );
    }

    if (
      certificate.status ===
      "ISSUED"
    ) {
      throw new Error(
        "An issued certificate cannot be cancelled.",
      );
    }

    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        status: "CANCELLED",

        cancelledAt:
          new Date(),

        cancelledBy:
          cancelledBy ?? null,

        cancelReason:
          reason.trim(),
      },
    });
  },

  /* --------------------------------------------------
   * Status update
   * -------------------------------------------------- */

  async updateStatus(
    certificateId: string,
    input: CertificateStatusInput,
  ) {
    const data =
      certificateStatusSchema.parse(
        input,
      );

    return prisma.certificate.update({
      where: {
        id: certificateId,
      },

      data: {
        status:
          data.status,
      },
    });
  },
};
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {
  // --------------------------------------------------
  // Find School
  // --------------------------------------------------

  const school = await prisma.school.findFirst();

  if (!school) {
    throw new Error(
      "No school found. Please create a school before running the seed."
    );
  }

  const schoolId = school.id;

  // --------------------------------------------------
  // CICA COURSE STRUCTURE
  // --------------------------------------------------

  const courses = [
    // 1. PGDCA
    {
      code: "PGDCA",
      name: "Post Graduate Diploma in Computer Applications",
      durationMonths: 12,
      totalFee: 5400,
      admissionFee: 370,
      monthlyFee: 450,
      certificateFee: 500,
      installmentCount: 12,
    },

    // 2. DCA
    {
      code: "DCA",
      name: "Diploma in Computer Applications",
      durationMonths: 9,
      totalFee: 4050,
      admissionFee: 370,
      monthlyFee: 450,
      certificateFee: 500,
      installmentCount: 9,
    },

    // 3. DEO
    {
      code: "DEO",
      name: "Diploma in Office Automation",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 4. DTP
    {
      code: "DTP",
      name: "Desktop Publishing",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 5. MS OFFICE
    {
      code: "MSOFFICE",
      name: "MS.OFFICE",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 6. TALLY
    {
      code: "TALLY",
      name: "TALLY",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 7. C, C++
    {
      code: "CPP",
      name: "C, C++",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 8. JAVA
    {
      code: "JAVA",
      name: "JAVA",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 9. PYTHON
    {
      code: "PYTHON",
      name: "PYTHON",
      durationMonths: 3,
      totalFee: 3870,
      admissionFee: 1770,
      monthlyFee: 700,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 10. SUMMER COURSE
    {
      code: "SUMMER",
      name: "SUMMER COURSE (ONLY FOR 10TH STUDENT)",
      durationMonths: 3,
      totalFee: 2000,
      admissionFee: 1000,
      monthlyFee: 500,
      certificateFee: 500,
      installmentCount: 3,
    },

    // 11. OS-CIT
    {
      code: "OSCIT",
      name: "OS-CIT",
      durationMonths: 3,
      totalFee: 4000,
      admissionFee: 1500,
      monthlyFee: 1250,
      certificateFee: 0,
      installmentCount: 3,
    },

    // 12. OS-CIT A
    {
      code: "OSCITA",
      name: "OS-CIT A",
      durationMonths: 6,
      totalFee: 9000,
      admissionFee: 1500,
      monthlyFee: 1500,
      certificateFee: 0,
      installmentCount: 6,
    },

    // 13. OS-CIT A+
    {
      code: "OSCITAPLUS",
      name: "OS-CIT A+",
      durationMonths: 12,
      totalFee: 16000,
      admissionFee: 4000,
      monthlyFee: 1000,
      certificateFee: 0,
      installmentCount: 12,
    },

    // 14. DGD
    {
      code: "DGD",
      name: "DGD",
      durationMonths: 4,
      totalFee: 10000,
      admissionFee: 5000,
      monthlyFee: 2500,
      certificateFee: 500,
      installmentCount: 4,
    },
  ];

  // --------------------------------------------------
  // UPSERT COURSES + FEE SCHEDULES
  // --------------------------------------------------

  for (const course of courses) {
    // -----------------------------------------------
    // Create / Update Course
    // -----------------------------------------------

    const savedCourse = await prisma.course.upsert({
      where: {
        schoolId_code: {
          schoolId,
          code: course.code,
        },
      },

      update: {
        name: course.name,
        durationMonths: course.durationMonths,

        admissionFee: course.admissionFee,
        monthlyFee: course.monthlyFee,
        certificateFee: course.certificateFee,
        totalFee: course.totalFee,

        installmentCount: course.installmentCount,

        isActive: true,
      },

      create: {
        schoolId,

        code: course.code,
        name: course.name,

        durationMonths: course.durationMonths,

        admissionFee: course.admissionFee,
        monthlyFee: course.monthlyFee,
        certificateFee: course.certificateFee,
        totalFee: course.totalFee,

        installmentCount: course.installmentCount,

        isActive: true,
      },
    });

    // -----------------------------------------------
    // Admission Fee Schedule
    // -----------------------------------------------

    await prisma.feeSchedule.upsert({
      where: {
        courseId_title: {
          courseId: savedCourse.id,
          title: "Admission Fee",
        },
      },

      update: {
        amount: course.admissionFee,
        dueOrder: 1,
        isMandatory: true,
        isActive: course.admissionFee > 0,
      },

      create: {
        schoolId,
        courseId: savedCourse.id,

        title: "Admission Fee",
        amount: course.admissionFee,

        dueOrder: 1,
        isMandatory: true,
        isActive: course.admissionFee > 0,
      },
    });

    // -----------------------------------------------
    // Monthly Fee Schedule
    // -----------------------------------------------

    await prisma.feeSchedule.upsert({
      where: {
        courseId_title: {
          courseId: savedCourse.id,
          title: "Monthly Fee",
        },
      },

      update: {
        amount: course.monthlyFee,
        dueOrder: 2,
        isMandatory: true,
        isActive: course.monthlyFee > 0,
      },

      create: {
        schoolId,
        courseId: savedCourse.id,

        title: "Monthly Fee",
        amount: course.monthlyFee,

        dueOrder: 2,
        isMandatory: true,
        isActive: course.monthlyFee > 0,
      },
    });

    // -----------------------------------------------
    // Certificate Fee Schedule
    // -----------------------------------------------

    await prisma.feeSchedule.upsert({
      where: {
        courseId_title: {
          courseId: savedCourse.id,
          title: "Certificate Fee",
        },
      },

      update: {
        amount: course.certificateFee,
        dueOrder: 3,
        isMandatory: false,
        isActive: course.certificateFee > 0,
      },

      create: {
        schoolId,
        courseId: savedCourse.id,

        title: "Certificate Fee",
        amount: course.certificateFee,

        dueOrder: 3,
        isMandatory: false,
        isActive: course.certificateFee > 0,
      },
    });

    console.log(
      `✅ ${course.code} | Admission ₹${course.admissionFee} | Monthly ₹${course.monthlyFee} | Total ₹${course.totalFee}`
    );
  }

  // --------------------------------------------------
  // Finished
  // --------------------------------------------------

  console.log("");
  console.log("==========================================");
  console.log("✅ CICA courses and fee schedules seeded");
  console.log(`🏫 School: ${school.name}`);
  console.log(`📚 Courses updated: ${courses.length}`);
  console.log("==========================================");
}

// --------------------------------------------------
// RUN SEED
// --------------------------------------------------

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
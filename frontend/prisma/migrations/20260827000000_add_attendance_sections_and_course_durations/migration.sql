-- Add batch attendance sections while preserving legacy attendance rows.
CREATE TYPE "AttendanceSectionType" AS ENUM ('THEORY', 'PRACTICAL');

ALTER TABLE "Course"
  ADD COLUMN "theoryDurationDays" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "practicalDurationDays" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "AttendanceRecord"
  ADD COLUMN "sectionType" "AttendanceSectionType";

CREATE INDEX "AttendanceRecord_batchId_sectionType_date_idx"
  ON "AttendanceRecord"("batchId", "sectionType", "date");

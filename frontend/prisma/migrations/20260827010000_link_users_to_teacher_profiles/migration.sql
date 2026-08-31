-- Link eligible User accounts to canonical academic Teacher profiles.
ALTER TABLE "Teacher" ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

ALTER TABLE "Teacher"
  ADD CONSTRAINT "Teacher_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

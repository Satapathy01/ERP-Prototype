const schoolId = process.env.SCHOOL_ID;

if (!schoolId) {
  throw new Error(
    "SCHOOL_ID is not configured. Add SCHOOL_ID to your .env file.",
  );
}

export const SCHOOL_ID = schoolId;
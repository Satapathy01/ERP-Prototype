import { prisma } from "@/lib/prisma";

interface AttendanceQuery {
	studentId?: string;
	courseId?: string;
	batchId?: string;
	sectionType?: "THEORY" | "PRACTICAL";
	date?: Date;
	from?: Date;
	to?: Date;
	status?: string;
	source?: string;
}

interface AttendanceRecordInput {
	studentId: string;
	status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
	remarks?: string;
}

interface MarkAttendanceInput {
	courseId?: string;
	batchId?: string;
	sectionType?: "THEORY" | "PRACTICAL";
	date?: Date;
	records: AttendanceRecordInput[];
	source: "MANUAL" | "CLASS";
}

export async function getAttendance(schoolId: string, query: AttendanceQuery) {
	const where: Record<string, unknown> = { schoolId };
	if (query.studentId) where.studentId = query.studentId;
	if (query.courseId) where.courseId = query.courseId;
	if (query.batchId) where.batchId = query.batchId;
	if (query.sectionType) where.sectionType = query.sectionType;
	if (query.status) where.status = query.status;
	if (query.source) where.source = query.source;
	if (query.date) {
		const start = new Date(query.date);
		start.setHours(0, 0, 0, 0);
		const end = new Date(start);
		end.setDate(end.getDate() + 1);
		where.date = { gte: start, lt: end };
	}
	if (query.from || query.to) {
		where.date = { ...(query.from ? { gte: query.from } : {}), ...(query.to ? { lte: query.to } : {}) };
	}
	return prisma.attendanceRecord.findMany({
		where,
		include: { student: true, course: true, batch: true, campusEntry: true },
		orderBy: { date: "desc" },
	});
}

export async function getStudentHistory(schoolId: string, studentId: string) {
	return prisma.attendanceRecord.findMany({
		where: { schoolId, studentId },
		include: { course: true, batch: true, campusEntry: true },
		orderBy: { date: "desc" },
	});
}

export async function getDailyAttendance(
	schoolId: string,
	courseId: string,
	batchId: string,
	sectionType: "THEORY" | "PRACTICAL" | undefined,
	date: Date,
) {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(end.getDate() + 1);
	return prisma.attendanceRecord.findMany({
		where: { schoolId, courseId, batchId, ...(sectionType ? { sectionType } : {}), date: { gte: start, lt: end } },
		include: { student: true, course: true, batch: true },
		orderBy: { student: { name: "asc" } },
	});
}

export async function getBatchStudents(
	schoolId: string,
	courseId: string,
	batchId: string,
	sectionType?: "THEORY" | "PRACTICAL",
	date?: Date,
) {
	const admissions = await prisma.admission.findMany({
		where: { schoolId, courseId, batchId, isActive: true },
		select: { student: { select: { id: true, name: true, registrationNumber: true } } },
		orderBy: { student: { name: "asc" } },
	});
	if (!sectionType || !date || admissions.length === 0) {
		return admissions.map((admission) => ({ student: admission.student, status: null, remarks: null }));
	}
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(end.getDate() + 1);
	const records = await prisma.attendanceRecord.findMany({
		where: { schoolId, courseId, batchId, sectionType, date: { gte: start, lt: end }, studentId: { in: admissions.map((admission) => admission.student.id) } },
		select: { studentId: true, status: true, remarks: true },
	});
	const byStudent = new Map(records.map((record) => [record.studentId, record]));
	return admissions.map((admission) => ({
		student: admission.student,
		status: byStudent.get(admission.student.id)?.status ?? null,
		remarks: byStudent.get(admission.student.id)?.remarks ?? null,
	}));
}

export async function getSummary(
	schoolId: string,
	options?: { studentId?: string; courseId?: string; batchId?: string; sectionType?: "THEORY" | "PRACTICAL"; from?: Date; to?: Date },
) {
	const where: Record<string, unknown> = { schoolId };
	if (options?.studentId) where.studentId = options.studentId;
	if (options?.courseId) where.courseId = options.courseId;
	if (options?.batchId) where.batchId = options.batchId;
	if (options?.sectionType) where.sectionType = options.sectionType;
	if (options?.from || options?.to) where.date = { ...(options.from ? { gte: options.from } : {}), ...(options.to ? { lte: options.to } : {}) };
	const records = await prisma.attendanceRecord.findMany({ where, select: { status: true } });
	const present = records.filter((record) => record.status === "PRESENT").length;
	const late = records.filter((record) => record.status === "LATE").length;
	const attendancePercentage = records.length > 0 ? Number((((present + late) / records.length) * 100).toFixed(2)) : 0;
	return {
		total: records.length,
		present,
		absent: records.filter((record) => record.status === "ABSENT").length,
		late,
		excused: records.filter((record) => record.status === "EXCUSED").length,
		attendancePercentage,
	};
}

export async function getDashboardSummary(schoolId: string) {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(end.getDate() + 1);

	const [totalStudents, records] = await Promise.all([
		prisma.student.count({
			where: { schoolId, status: "ACTIVE" },
		}),
		prisma.attendanceRecord.findMany({
			where: { schoolId, date: { gte: start, lt: end } },
			select: { studentId: true, status: true },
		}),
	]);

	const presentStudents = new Set<string>();
	const absentStudents = new Set<string>();

	for (const record of records) {
		if (record.status === "PRESENT" || record.status === "LATE") {
			presentStudents.add(record.studentId);
		}
		if (record.status === "ABSENT") {
			absentStudents.add(record.studentId);
		}
	}

	const totalMarked = presentStudents.size + absentStudents.size;
	const presentToday = presentStudents.size;
	const absentToday = Math.max(absentStudents.size - presentStudents.size, 0);

	return {
		totalStudents,
		presentToday,
		absentToday,
		attendancePercentage: totalMarked > 0
			? Number(((presentToday / totalMarked) * 100).toFixed(2))
			: 0,
	};
}

export async function markAttendance(schoolId: string, markedById: string, data: MarkAttendanceInput) {
	const date = data.date ? new Date(data.date) : new Date();
	date.setHours(0, 0, 0, 0);
	return prisma.$transaction(async (tx) => {
		if (!data.courseId || !data.batchId || !data.sectionType) throw new Error("Course, batch, and attendance section are required.");
		const batch = await tx.batch.findFirst({ where: { id: data.batchId, schoolId, courseId: data.courseId } });
		if (!batch) throw new Error("The selected batch does not belong to this course.");
		const results = [];
		for (const record of data.records) {
			const admission = await tx.admission.findFirst({ where: { schoolId, studentId: record.studentId, courseId: data.courseId, batchId: data.batchId, isActive: true } });
			if (!admission) throw new Error("Student does not belong to the selected batch.");
			const existing = await tx.attendanceRecord.findFirst({ where: { schoolId, studentId: record.studentId, courseId: data.courseId, batchId: data.batchId, sectionType: data.sectionType, date } });
			if (existing) {
				results.push(await tx.attendanceRecord.update({ where: { id: existing.id }, data: { status: record.status, remarks: record.remarks ?? null, markedById, source: data.source } }));
			} else {
				results.push(await tx.attendanceRecord.create({ data: { schoolId, studentId: record.studentId, courseId: data.courseId, batchId: data.batchId, sectionType: data.sectionType, date, status: record.status, source: data.source, remarks: record.remarks ?? null, markedById } }));
			}
		}
		return results;
	});
}

export async function findStudentByRegistrationNumber(schoolId: string, registrationNumber: string) {
	return prisma.student.findFirst({ where: { schoolId, registrationNumber } });
}

export async function findRecentCampusEntry(schoolId: string, studentId: string) {
	return prisma.campusEntry.findFirst({ where: { schoolId, studentId, scannedAt: { gte: new Date(Date.now() - 2 * 60 * 1000) } }, orderBy: { scannedAt: "desc" } });
}

export async function createCampusEntry(data: { schoolId: string; studentId: string; registrationNumber: string; deviceId?: string | null; gateName?: string | null }) {
	return prisma.campusEntry.create({ data: { schoolId: data.schoolId, studentId: data.studentId, registrationNumber: data.registrationNumber, deviceId: data.deviceId ?? null, gateName: data.gateName ?? null }, include: { student: true } });
}

export async function getCampusHistory(schoolId: string, options?: { studentId?: string; from?: Date; to?: Date; limit?: number }) {
	const where: Record<string, unknown> = { schoolId };
	if (options?.studentId) where.studentId = options.studentId;
	if (options?.from || options?.to) where.scannedAt = { ...(options.from ? { gte: options.from } : {}), ...(options.to ? { lte: options.to } : {}) };
	return prisma.campusEntry.findMany({ where, include: { student: true }, orderBy: { scannedAt: "desc" }, take: options?.limit ?? 100 });
}

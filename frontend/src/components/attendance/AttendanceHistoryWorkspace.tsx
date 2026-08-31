"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AttendanceHistory, type AttendanceHistoryRecord } from "./AttendanceHistory";

type Course = { id: string; code: string; name: string };
type Batch = { id: string; name: string; courseId: string };

export function AttendanceHistoryWorkspace() {
  const params = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courseId, setCourseId] = useState(params.get("courseId") ?? "");
  const [batchId, setBatchId] = useState(params.get("batchId") ?? "");
  const [sectionType, setSectionType] = useState(params.get("sectionType") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [studentId, setStudentId] = useState(params.get("studentId") ?? "");
  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/courses").then(async (response) => {
      if (response.ok) setCourses((await response.json()).data ?? []);
    });
  }, []);

  useEffect(() => {
    if (!courseId) {
      return;
    }
    void fetch(`/api/batches?courseId=${courseId}`).then(async (response) => {
      if (response.ok) setBatches((await response.json()).data ?? []);
    });
  }, [courseId]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams();
    if (courseId) query.set("courseId", courseId);
    if (batchId) query.set("batchId", batchId);
    if (sectionType) query.set("sectionType", sectionType);
    if (date) query.set("date", date);
    if (studentId) query.set("studentId", studentId);
    void fetch(`/api/attendance?${query}`, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      if (response.ok) {
        const result = await response.json();
        setRecords((result.data ?? []).map((record: {
          id: string; student: { name: string; registrationNumber: string };
          date: string; status: AttendanceHistoryRecord["status"];
          source: AttendanceHistoryRecord["source"]; course?: { name: string } | null;
          batch?: { name: string } | null; sectionType?: "THEORY" | "PRACTICAL" | null; remarks?: string | null;
        }) => ({
          id: record.id,
          studentName: record.student.name,
          registrationNumber: record.student.registrationNumber,
          date: record.date,
          status: record.status,
          source: record.source,
          courseName: record.course?.name,
          batchName: record.batch?.name,
          sectionType: record.sectionType,
          remarks: record.remarks,
        })));
      }
      setLoading(false);
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setRecords([]);
      setLoading(false);
    });

    return () => controller.abort();
  }, [courseId, batchId, sectionType, date, studentId]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-5">
        <select className="rounded-md border px-3 py-2" value={courseId} onChange={(event) => { setCourseId(event.target.value); setBatchId(""); }}><option value="">All courses</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code}</option>)}</select>
        <select className="rounded-md border px-3 py-2" value={batchId} onChange={(event) => setBatchId(event.target.value)} disabled={!courseId}><option value="">All batches</option>{batches.filter((batch) => batch.courseId === courseId).map((batch) => <option key={batch.id} value={batch.id}>{batch.name}</option>)}</select>
        <select className="rounded-md border px-3 py-2" value={sectionType} onChange={(event) => setSectionType(event.target.value)}><option value="">All sections</option><option value="THEORY">Theory</option><option value="PRACTICAL">Practical</option></select>
        <input type="date" className="rounded-md border px-3 py-2" value={date} onChange={(event) => setDate(event.target.value)} />
        <input className="rounded-md border px-3 py-2" placeholder="Student ID" value={studentId} onChange={(event) => setStudentId(event.target.value)} />
      </div>
      {loading ? <p className="p-8 text-center text-muted-foreground">Loading attendance...</p> : <AttendanceHistory records={records} />}
    </div>
  );
}

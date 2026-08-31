"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ClassAttendanceTable, type ClassAttendanceStudent } from "./ClassAttendanceTable";

type Course = { id: string; code: string; name: string };
type Batch = { id: string; name: string; courseId: string; currentStrength: number };

export function AttendanceWorkspace({ source = "CLASS" }: { source?: "CLASS" | "MANUAL" }) {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchesCourseId, setBatchesCourseId] = useState("");
  const [students, setStudents] = useState<ClassAttendanceStudent[]>([]);
  const [studentsBatchId, setStudentsBatchId] = useState("");
  const [studentsSectionType, setStudentsSectionType] = useState("");
  const [studentsDate, setStudentsDate] = useState("");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") ?? "");
  const [batchId, setBatchId] = useState(searchParams.get("batchId") ?? "");
  const [sectionType, setSectionType] = useState<"THEORY" | "PRACTICAL">(
    searchParams.get("sectionType") === "PRACTICAL" ? "PRACTICAL" : "THEORY",
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");

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
      if (response.ok) {
        setBatches((await response.json()).data ?? []);
        setBatchesCourseId(courseId);
      }
    });
  }, [courseId]);

  useEffect(() => {
    if (!courseId || !batchId) {
      return;
    }
    void fetch(`/api/attendance/students?courseId=${courseId}&batchId=${batchId}&sectionType=${sectionType}&date=${date}`).then(async (response) => {
      if (response.ok) {
        setStudents((await response.json()).data ?? []);
        setStudentsBatchId(batchId);
        setStudentsSectionType(sectionType);
        setStudentsDate(date);
      }
    });
  }, [courseId, batchId, sectionType, date]);

  async function saveAttendance(records: { studentId: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; remarks?: string }[]) {
    setMessage("");
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, batchId, sectionType, date, records, source }),
    });
    const result = await response.json();
    setMessage(result.message ?? (response.ok ? "Attendance saved." : "Unable to save attendance."));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-4">
        <label className="space-y-1 text-sm font-medium">Course
          <select className="w-full rounded-md border px-3 py-2" value={courseId} onChange={(event) => { setCourseId(event.target.value); setBatchId(""); }}>
            <option value="">Select course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">Batch
          <select className="w-full rounded-md border px-3 py-2" value={batchId} onChange={(event) => setBatchId(event.target.value)} disabled={!courseId}>
            <option value="">Select batch</option>
            {(batchesCourseId === courseId ? batches : []).map((batch) => <option key={batch.id} value={batch.id}>{batch.name} ({batch.currentStrength})</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">Section
          <select className="w-full rounded-md border px-3 py-2" value={sectionType} onChange={(event) => setSectionType(event.target.value as "THEORY" | "PRACTICAL")}>
            <option value="THEORY">Theory</option>
            <option value="PRACTICAL">Practical</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">Date
          <input type="date" className="w-full rounded-md border px-3 py-2" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      {!courseId || !batchId ? <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Select a course and batch to load students.</p> : <ClassAttendanceTable key={`${batchId}-${sectionType}-${date}-${studentsBatchId}-${studentsSectionType}-${studentsDate}`} students={studentsBatchId === batchId && studentsSectionType === sectionType && studentsDate === date ? students : []} onSubmit={saveAttendance} />}
    </div>
  );
}

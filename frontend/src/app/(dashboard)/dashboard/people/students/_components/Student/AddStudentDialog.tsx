"use client";

import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface Course {
  id: string;
  code: string;
  name: string;

  durationMonths: number;

  admissionFee: number;
  monthlyFee: number;
  certificateFee: number;
  totalFee: number;

  installmentCount: number;
}

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);

  // --------------------------------------------------
  // Student
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // --------------------------------------------------
  // Course
  // --------------------------------------------------

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Load courses when dialog opens
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return;

    async function loadCourses() {
      try {
        setCoursesLoading(true);

        const response = await fetch("/api/courses");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ?? "Failed to load courses."
          );
        }

        setCourses(result.data ?? []);
      } catch (error) {
        console.error("Course loading error:", error);

        alert(
          error instanceof Error
            ? error.message
            : "Failed to load courses."
        );
      } finally {
        setCoursesLoading(false);
      }
    }

    loadCourses();
  }, [open]);

  // --------------------------------------------------
  // Selected course
  // --------------------------------------------------

  const selectedCourse = courses.find(
    (course) => course.id === courseId
  );

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter student name.");
      return;
    }

    if (!courseId) {
      alert("Please select a course.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          fatherName,
          motherName,
          studentPhone,
          parentPhone,
          email,
          dateOfBirth,
          status,

          // Selected course
          courseId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ?? "Failed to create student."
        );
      }

      // ------------------------------------------------
      // Reset
      // ------------------------------------------------

      setName("");
      setFatherName("");
      setMotherName("");
      setStudentPhone("");
      setParentPhone("");
      setEmail("");
      setDateOfBirth("");
      setStatus("ACTIVE");
      setCourseId("");

      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error("Create student error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create student."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Student</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>

          <DialogDescription>
            Register a new student and assign a course.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* ------------------------------------------ */}
          {/* Student Name */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Student Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Father */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Father&apos;s Name</Label>

            <Input
              value={fatherName}
              onChange={(e) =>
                setFatherName(e.target.value)
              }
              placeholder="Enter father's name"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Mother */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Mother&apos;s Name</Label>

            <Input
              value={motherName}
              onChange={(e) =>
                setMotherName(e.target.value)
              }
              placeholder="Enter mother's name"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* DOB */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Date of Birth</Label>

            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Student Phone */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Student Phone</Label>

            <Input
              value={studentPhone}
              onChange={(e) =>
                setStudentPhone(e.target.value)
              }
              placeholder="Enter student phone"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Parent Phone */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Parent Phone</Label>

            <Input
              value={parentPhone}
              onChange={(e) =>
                setParentPhone(e.target.value)
              }
              placeholder="Enter parent phone"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* Email */}
          {/* ------------------------------------------ */}

          <div className="space-y-2 md:col-span-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email"
            />
          </div>

          {/* ------------------------------------------ */}
          {/* COURSE */}
          {/* ------------------------------------------ */}

          <div className="space-y-2 md:col-span-2">
            <Label>Course</Label>

            <select
              value={courseId}
              onChange={(e) =>
                setCourseId(e.target.value)
              }
              disabled={coursesLoading}
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">
                {coursesLoading
                  ? "Loading courses..."
                  : "Select Course"}
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.code} — {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* ------------------------------------------ */}
          {/* COURSE FEE PREVIEW */}
          {/* ------------------------------------------ */}

          {selectedCourse && (
            <div className="md:col-span-2 rounded-lg border bg-muted/20 p-4">
              <div className="mb-3">
                <h3 className="font-semibold">
                  {selectedCourse.code}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selectedCourse.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Admission Fee
                  </p>

                  <p className="font-semibold">
                    ₹
                    {selectedCourse.admissionFee.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Monthly Fee
                  </p>

                  <p className="font-semibold">
                    ₹
                    {selectedCourse.monthlyFee.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Duration
                  </p>

                  <p className="font-semibold">
                    {selectedCourse.durationMonths} months
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Fee
                  </p>

                  <p className="font-semibold">
                    ₹
                    {selectedCourse.totalFee.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* STATUS */}
          {/* ------------------------------------------ */}

          <div className="space-y-2">
            <Label>Status</Label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ALUMNI">ALUMNI</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* ------------------------------------------ */}
          {/* ACTIONS */}
          {/* ------------------------------------------ */}

          <div className="flex justify-end gap-2 pt-4 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                coursesLoading ||
                !courseId
              }
            >
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
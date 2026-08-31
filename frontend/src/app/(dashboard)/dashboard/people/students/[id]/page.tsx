import { notFound } from "next/navigation";
import { getStudentById } from "~/modules/student";
import { getAuthenticationUser } from "~/modules/auth/auth.helper";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import StudentDialog from "~/components/students/StudentDialog";
import { AdmissionEditDialog } from "~/components/admission/AdmissionEditDialog";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const user = await getAuthenticationUser();

  if (!user) {
    notFound();
  }

  const student = await getStudentById(id, user.schoolId);

  if (!student) {
    notFound();
  }

  const editableStudent = {
    id: student.id,
    schoolId: student.schoolId,
    registrationNumber: student.registrationNumber,
    name: student.name,
    fatherName: student.fatherName,
    motherName: student.motherName,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    bloodGroup: student.bloodGroup,
    studentPhone: student.studentPhone,
    parentPhone: student.parentPhone,
    email: student.email,
    address: student.address,
    city: student.city,
    state: student.state,
    pinCode: student.pinCode,
    aadhaarNumber: student.aadhaarNumber,
    photoUrl: student.photoUrl,
    status: student.status,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };

  const editCourseId = student.admissions[0]?.courseId;

  return (
  <div className="space-y-6">
    <Button asChild variant="outline">
      <Link href="/dashboard/people/students">
        ← Back
      </Link>
    </Button>

    <div>
      <h1 className="text-3xl font-bold">Student Details</h1>
      <p className="text-muted-foreground">
        View complete student information.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Registration Number
          </p>
          <p className="font-medium">
            {student.registrationNumber}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Student Name
          </p>
          <p className="font-medium">
            {student.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Father&apos;s Name
          </p>
          <p className="font-medium">
            {student.fatherName ?? "-"}
          </p>
        </div>

        <div>
  <p className="text-sm text-muted-foreground">
    Mother&apos;s Name
  </p>
  <p className="font-medium">
    {student.motherName ?? "-"}
  </p>
</div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <Badge>
            {student.status}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Date of Birth
          </p>

          <p className="font-medium">
            {student.dateOfBirth
              ? student.dateOfBirth.toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
  <p className="text-sm text-muted-foreground">
    Student Phone
  </p>

  <p className="font-medium">
    {student.studentPhone ?? "-"}
  </p>
</div>
         <div>
  <p className="text-sm text-muted-foreground">
    Gender
  </p>
  <p className="font-medium">
    {student.gender ?? "-"}
  </p>
</div>

<div>
  <p className="text-sm text-muted-foreground">
    Blood Group
  </p>
  <p className="font-medium">
    {student.bloodGroup ?? "-"}
  </p>
</div>

<div>
  <p className="text-sm text-muted-foreground">
    Parent Phone
  </p>
  <p className="font-medium">
    {student.parentPhone ?? "-"}
  </p>
</div>
        <div>
          <p className="text-sm text-muted-foreground">
            Created At
          </p>

          <p className="font-medium">
            {student.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Updated At
          </p>

          <p className="font-medium">
            {student.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Admissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {student.admissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admissions found.</p>
        ) : (
          student.admissions.map((admission) => (
            <div key={admission.id} className="rounded-md border p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{admission.course.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">{admission.batch?.name ?? "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p className="font-medium">{admission.admissionDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{admission.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>
              {admission.session && <p className="mt-3 text-sm text-muted-foreground">Session: {admission.session}</p>}
              <div className="mt-4 border-t pt-3">
                <AdmissionEditDialog
                  schoolId={user.schoolId}
                  admission={{
                    id: admission.id,
                    courseId: admission.courseId,
                    batchId: admission.batchId,
                    session: admission.session,
                    isActive: admission.isActive,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>

    <StudentDialog
      schoolId={user.schoolId}
      student={editableStudent}
      courseId={editCourseId}
      trigger={<Button>Edit Student</Button>}
    />
  </div>
);
}
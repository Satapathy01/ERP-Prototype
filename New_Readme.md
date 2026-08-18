ERP Prototype --- Finance & ERP Changes

Overview

This branch contains the current School ERP development work, with the
main focus on the Finance/Payments module and supporting work across
Students, Courses, Admissions, Dashboard, Excel imports, AI header
matching, fees, batches, attendance, teachers, exams, notices,
documents, storage, and UI cleanup.

Branch: feature/finance

Major Changes

Finance & Payments

Added/reworked the Finance architecture around:

Finance API routes

Finance services

Payment creation/update/delete flows

Payment history

Payment details

Finance dashboard data

Payment summaries

Finance dialogs

Payment hooks

New/updated areas include:

src/app/api/finance/
src/app/(dashboard)/dashboard/operations/finance/
src/components/finance/
src/modules/finance/services/
src/hooks/useFinance.ts
src/hooks/useFinanceActions.ts
src/hooks/useFinanceDashboard.ts
src/hooks/useFinanceDialogs.ts
src/hooks/useFinanceSummary.ts
src/hooks/use-payment-history.ts

The older src/components/ui/finance/ implementation and older
src/modules/finance/ service files were removed as part of the newer
architecture.

Recent Payments

src/components/dashboard/RecentPayments.tsx was connected to the real
Finance API instead of static/demo data.

It now supports:

Latest payments

Student name

Course name

Amount

Payment date

Payment status

Student initials

Loading state

Empty state

Error state

Payment-detail navigation

View All navigation

The component consumes the Finance endpoint:

/api/finance

Course Management

Added Course Master functionality:

src/app/(dashboard)/dashboard/course/
src/components/course/
src/modules/courses/

Course data supports:

Code

Name

Duration

Admission fee

Monthly fee

Installments

Discount

Total fee

Active status

Course deletion, services, schemas, dialogs, forms, and tables were
added.

Registration Number Generation

Added:

src/lib/generate-registration-number.ts

Registration numbers are generated using the school and current year
with a sequential six-digit suffix.

Example format:

CICA26000001

Student Management

Updated:

src/app/(dashboard)/dashboard/people/students/
src/components/students/
src/modules/student/

Improvements cover:

Student listing

Student details

Add student

Search

Student table

Student service/schema/types

Excel import integration

Excel Student Import

Added a structured import system:

src/modules/import/
├── ai/
├── engine/
├── memory/
├── shared/
└── students/

The import pipeline covers:

Excel
→ Parser
→ Header Normalizer
→ Memory
→ Ollama AI
→ Confidence
→ Mapping
→ Validation
→ Student Import
→ Prisma

Ollama AI Header Matching

The import system now uses Ollama for intelligent Excel-header mapping.

Environment:

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b

AI components:

src/modules/import/ai/
├── confidence.ts
├── index.ts
├── matcher.ts
├── ollama.client.ts
├── parser.ts
├── prompt.ts
└── types.ts

The AI returns structured JSON containing:

ERP field

Confidence

Reasoning

Confidence handling:

Confidence   Level    Action

95--100      HIGH     Auto accept
75--94       MEDIUM   Ask user
0--74        LOW      Reject

Import Memory Learning

Added persistent header-learning through Prisma:

src/modules/import/memory/memory.ts
src/modules/import/memory/types.ts

Mappings are stored per school using the normalized header and can be
reused in future imports.

Weak mappings and UNKNOWN mappings are ignored.

Import Upload UI

Updated student upload functionality with:

.xlsx support

Loading state

Import summary

Error handling

File reset after success

Success callback

Endpoint:

/api/import/students

Dashboard

Expanded dashboard functionality under:

src/components/dashboard/
src/modules/dashboard/
src/app/api/dashboard/

Includes Recent Payments, Revenue, notices, and finance-related
dashboard data.

Revenue Chart

Cleaned the dashboard revenue chart and removed unused Recharts types.

Theme & Responsive UI

Updated:

src/components/theme-segment-control.tsx
src/components/theme-toggle-button.tsx
src/hooks/use-mobile.ts
src/components/ui/carousel.tsx

Theme supports:

Light

Dark

System

Mobile detection uses a 768px breakpoint.

Storage & Image Utilities

Added storage utilities under:

src/lib/storage/

Image utilities use sharp for:

Compression

Resizing

JPEG/WebP/PNG output

Thumbnail generation

Metadata extraction

Admissions, Batches & Fees

Added foundations for:

src/modules/admission/
src/modules/batch/
src/modules/fee/

and related hooks/APIs.

These modules connect students, courses, admissions, batches, fees, and
payments.

Additional ERP Modules

Added foundations for:

src/modules/attendance/
src/modules/teacher/
src/modules/exams/
src/modules/notice/
src/modules/document/

Authentication Pages

Updated:

src/app/(auth)/forgot-password/page.tsx
src/app/(auth)/reset-password/page.tsx
src/app/(auth)/verify-otp/page.tsx

Prisma / Database

Updated:

prisma.config.ts
prisma/schema.prisma
src/lib/prisma.ts

Added:

prisma/seed.ts

The project continues to use Prisma for database access.

UI / React Cleanup

The project was checked using:

npm run lint

The cleanup addressed:

Unused imports

Unused variables

React Hook Form compiler warnings

React state updates inside effects

TanStack Table React Compiler warning

FeeSchedule effect dependency warning

Legacy Finance components

DataTable keeps TanStack Table's useReactTable() API with a targeted
ESLint suppression because the API is intentionally incompatible with
React Compiler memoization.

FeeSchedule was changed to notify selection changes directly during
selection updates rather than using an effect only to synchronize state.

DataTable

Updated:

src/components/data-table/

Features include:

Sorting

Filtering

Pagination

Column visibility

Row selection

Bulk actions

Search

Empty state

Toolbar

Pagination controls

Architecture

General ERP flow

UI
 ↓
Hooks
 ↓
API Routes
 ↓
Services
 ↓
Prisma
 ↓
PostgreSQL

Finance flow

Dashboard / Finance UI
 ↓
Finance Hooks
 ↓
Finance API
 ↓
Finance Services
 ↓
Prisma
 ↓
Database

Student import flow

Excel
 ↓
Excel Parser
 ↓
Header Normalizer
 ↓
Memory Lookup
 ↓
Ollama AI
 ↓
Confidence Evaluation
 ↓
Field Mapping
 ↓
Validation
 ↓
Student Import Service
 ↓
Prisma

Development Commands

Install dependencies:

npm install

Run development server:

npm run dev

Run lint:

npm run lint

Build:

npm run build

Ollama Setup

Check Ollama:

ollama --version

List models:

ollama list

Run the configured model:

ollama run qwen3:8b

The application expects:

http://localhost:11434

and calls:

/api/generate

Git

Current branch:

feature/finance

Review changes:

git status
git diff

Stage everything:

git add -A

Review staged changes:

git diff --cached --stat
git diff --cached --name-status

Commit:

git commit -m "What we created"

Push:

git push origin feature/finance

Current Status

Completed in this development cycle:

Finance API restructuring

Finance services

Payment history

Payment details

Finance dashboard data

Recent Payments integration

Course management

Admissions foundation

Registration number generator

Student management improvements

Excel student import

Ollama AI header matching

AI confidence handling

Import memory learning

Dashboard improvements

Theme improvements

Storage utilities

Image processing utilities

Fee module foundation

Batch module foundation

Attendance module foundation

Teacher module foundation

Exam module foundation

Notice module foundation

Document module foundation

React/ESLint cleanup

Verification

Run:

npm run lint

The intended final state is:

0 errors
0 warnings

This README documents the current Finance/ERP development cycle and the
architecture changes made across the project.
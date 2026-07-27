-- Create MaterialProgress when rebuilding the database from zero.
CREATE TABLE IF NOT EXISTS "material_progress" (
    "material_progress_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_progress_pkey"
        PRIMARY KEY ("material_progress_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS
"material_progress_user_id_material_id_key"
ON "material_progress"("user_id", "material_id");

CREATE INDEX IF NOT EXISTS
"material_progress_material_id_idx"
ON "material_progress"("material_id");

CREATE INDEX IF NOT EXISTS
"material_progress_user_id_idx"
ON "material_progress"("user_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'material_progress_material_id_fkey'
    ) THEN
        ALTER TABLE "material_progress"
        ADD CONSTRAINT "material_progress_material_id_fkey"
        FOREIGN KEY ("material_id")
        REFERENCES "learning_materials"("material_id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'material_progress_user_id_fkey'
    ) THEN
        ALTER TABLE "material_progress"
        ADD CONSTRAINT "material_progress_user_id_fkey"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("user_id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Remove the redundant Course -> Assessment relation if it still exists.
ALTER TABLE "courses"
DROP CONSTRAINT IF EXISTS "courses_assessment_id_fkey";

ALTER TABLE "courses"
DROP COLUMN IF EXISTS "assessment_id";

-- AlterTable
ALTER TABLE "material_progress" ALTER COLUMN "updated_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "correct_answer" DROP NOT NULL;

-- Create missing enums when rebuilding the database from zero.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'ProgramType'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "ProgramType" AS ENUM (
            'GENERAL',
            'DEPARTMENT'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'ProgramStatus'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "ProgramStatus" AS ENUM (
            'draft',
            'requesting_course',
            'course_in_progress',
            'waiting_approval',
            'active',
            'rejected',
            'completed'
        );
    END IF;
END $$;

-- ============================================================
-- ProposalStatus
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n
          ON n.oid = t.typnamespace
        WHERE t.typname = 'ProposalStatus'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "ProposalStatus" AS ENUM (
            'pending',
            'approved',
            'rejected',
            'revision'
        );
    END IF;
END $$;

-- ============================================================
-- EnrollmentStatus
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n
          ON n.oid = t.typnamespace
        WHERE t.typname = 'EnrollmentStatus'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "EnrollmentStatus" AS ENUM (
            'assigned',
            'in_progress',
            'completed'
        );
    END IF;
END $$;

-- ============================================================
-- RequestStatus
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n
          ON n.oid = t.typnamespace
        WHERE t.typname = 'RequestStatus'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "RequestStatus" AS ENUM (
            'pending',
            'in_progress',
            'submitted',
            'revision',
            'completed',
            'cancelled'
        );
    END IF;
END $$;

-- ============================================================
-- CourseApprovalStatus
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n
          ON n.oid = t.typnamespace
        WHERE t.typname = 'CourseApprovalStatus'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "CourseApprovalStatus" AS ENUM (
            'draft',
            'submitted',
            'revision',
            'approved',
            'rejected'
        );
    END IF;
END $$;

-- ============================================================
-- ProgramProposal columns
-- ============================================================

ALTER TABLE "program_proposals"
ADD COLUMN IF NOT EXISTS "department_id" INTEGER;

ALTER TABLE "program_proposals"
ADD COLUMN IF NOT EXISTS "review_note" TEXT;

ALTER TABLE "program_proposals"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "program_proposals"
ALTER COLUMN "status"
TYPE "ProposalStatus"
USING ("status"::text::"ProposalStatus");

ALTER TABLE "program_proposals"
ALTER COLUMN "status"
SET DEFAULT 'pending'::"ProposalStatus";

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'program_proposals_department_id_fkey'
          AND conrelid = '"program_proposals"'::regclass
    ) THEN
        ALTER TABLE "program_proposals"
        ADD CONSTRAINT "program_proposals_department_id_fkey"
        FOREIGN KEY ("department_id")
        REFERENCES "departments"("department_id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS
"program_proposals_department_id_idx"
ON "program_proposals"("department_id");

-- ============================================================
-- CourseEnrollment status
-- ============================================================

ALTER TABLE "course_enrollments"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "course_enrollments"
ALTER COLUMN "status"
TYPE "EnrollmentStatus"
USING ("status"::text::"EnrollmentStatus");

ALTER TABLE "course_enrollments"
ALTER COLUMN "status"
SET DEFAULT 'assigned'::"EnrollmentStatus";

-- Convert program_type text values into ProgramType enum.
ALTER TABLE "training_programs"
ALTER COLUMN "program_type"
TYPE "ProgramType"
USING (
  CASE
    WHEN "program_type" = 'GENERAL'
      THEN 'GENERAL'::"ProgramType"
    WHEN "program_type" = 'DEPARTMENT'
      THEN 'DEPARTMENT'::"ProgramType"
    ELSE NULL
  END
);

-- Remove the old text default before changing the status type.
ALTER TABLE "training_programs"
ALTER COLUMN "status" DROP DEFAULT;

-- Convert status text values into ProgramStatus enum.
ALTER TABLE "training_programs"
ALTER COLUMN "status"
TYPE "ProgramStatus"
USING (
  CASE
    WHEN "status" = 'draft'
      THEN 'draft'::"ProgramStatus"
    WHEN "status" = 'requesting_course'
      THEN 'requesting_course'::"ProgramStatus"
    WHEN "status" = 'course_in_progress'
      THEN 'course_in_progress'::"ProgramStatus"
    WHEN "status" = 'waiting_approval'
      THEN 'waiting_approval'::"ProgramStatus"
    WHEN "status" = 'active'
      THEN 'active'::"ProgramStatus"
    WHEN "status" = 'rejected'
      THEN 'rejected'::"ProgramStatus"
    WHEN "status" = 'completed'
      THEN 'completed'::"ProgramStatus"
    ELSE NULL
  END
);

-- ============================================================
-- CourseRequest status
-- ============================================================

ALTER TABLE "course_requests"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "course_requests"
ALTER COLUMN "status"
TYPE "RequestStatus"
USING ("status"::text::"RequestStatus");

ALTER TABLE "course_requests"
ALTER COLUMN "status"
SET DEFAULT 'pending'::"RequestStatus";

-- ============================================================
-- Course approval status
-- ============================================================

ALTER TABLE "courses"
ALTER COLUMN "approval_status" DROP DEFAULT;

ALTER TABLE "courses"
ALTER COLUMN "approval_status"
TYPE "CourseApprovalStatus"
USING ("approval_status"::text::"CourseApprovalStatus");

ALTER TABLE "courses"
ALTER COLUMN "approval_status"
SET DEFAULT 'draft'::"CourseApprovalStatus";

ALTER TABLE "training_programs"
ALTER COLUMN "status"
SET DEFAULT 'draft'::"ProgramStatus";

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "photo_url" TEXT;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "notify_certificate" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "notify_course" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "notify_deadline" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "default_report_format" TEXT NOT NULL DEFAULT 'pdf';

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "report_include_department_stats" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "report_include_employee_details" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

-- CreateTable
CREATE TABLE "question_options" (
    "option_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "badges" (
    "badge_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "point_rule" INTEGER,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("badge_id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "user_badge_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "awarded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("user_badge_id")
);

-- CreateIndex
CREATE INDEX "question_options_question_id_idx" ON "question_options"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_options_question_id_position_key" ON "question_options"("question_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE INDEX "user_badges_user_id_idx" ON "user_badges"("user_id");

-- CreateIndex
CREATE INDEX "user_badges_badge_id_idx" ON "user_badges"("badge_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE INDEX "course_enrollments_status_idx" ON "course_enrollments"("status");

-- CreateIndex
CREATE INDEX "course_requests_requested_by_idx" ON "course_requests"("requested_by");

-- CreateIndex
CREATE INDEX "course_requests_status_idx" ON "course_requests"("status");

-- CreateIndex
CREATE INDEX "courses_approval_status_idx" ON "courses"("approval_status");

-- CreateIndex
CREATE INDEX "courses_deadline_idx" ON "courses"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_name_key" ON "departments"("department_name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "material_progress_completed_idx" ON "material_progress"("completed");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_date_idx" ON "notifications"("created_date");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE INDEX "training_programs_proposal_id_idx" ON "training_programs"("proposal_id");

-- CreateIndex
CREATE INDEX "training_programs_program_type_idx" ON "training_programs"("program_type");

-- CreateIndex
CREATE INDEX "training_programs_status_idx" ON "training_programs"("status");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("badge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('pending', 'approved', 'rejected', 'revision');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'in_progress', 'submitted', 'revision', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('assigned', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "CourseApprovalStatus" AS ENUM ('draft', 'submitted', 'revision', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('GENERAL', 'DEPARTMENT');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('draft', 'requesting_course', 'course_in_progress', 'waiting_approval', 'active', 'rejected', 'completed');

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."assessment_results" DROP CONSTRAINT "assessment_results_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."assessment_results" DROP CONSTRAINT "assessment_results_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."assessments" DROP CONSTRAINT "assessments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."certificates" DROP CONSTRAINT "certificates_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."certificates" DROP CONSTRAINT "certificates_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_enrollments" DROP CONSTRAINT "course_enrollments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_enrollments" DROP CONSTRAINT "course_enrollments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_requests" DROP CONSTRAINT "course_requests_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_requests" DROP CONSTRAINT "course_requests_program_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_requests" DROP CONSTRAINT "course_requests_requested_by_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."course_requests" DROP CONSTRAINT "course_requests_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."courses" DROP CONSTRAINT "courses_program_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."courses" DROP CONSTRAINT "courses_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."learning_materials" DROP CONSTRAINT "learning_materials_course_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."program_proposals" DROP CONSTRAINT "program_proposals_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."program_proposals" DROP CONSTRAINT "program_proposals_submitted_by_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."question_options" DROP CONSTRAINT "question_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."questions" DROP CONSTRAINT "questions_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."training_programs" DROP CONSTRAINT "training_programs_created_by_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."training_programs" DROP CONSTRAINT "training_programs_department_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."training_programs" DROP CONSTRAINT "training_programs_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."user_badges" DROP CONSTRAINT "user_badges_badge_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."user_badges" DROP CONSTRAINT "user_badges_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."users" DROP CONSTRAINT "users_department_id_fkey";

-- DropForeignKey
ALTER TABLE "lms_schema_audit_20260727_090827"."users" DROP CONSTRAINT "users_role_id_fkey";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."assessment_results";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."assessments";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."badges";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."certificates";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."course_enrollments";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."course_requests";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."courses";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."departments";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."learning_materials";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."material_progress";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."notifications";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."program_proposals";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."question_options";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."questions";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."roles";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."training_programs";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."user_badges";

-- DropTable
DROP TABLE "lms_schema_audit_20260727_090827"."users";

-- DropEnum
DROP TYPE "lms_schema_audit_20260727_090827"."ProgramStatus";

-- DropEnum
DROP TYPE "lms_schema_audit_20260727_090827"."ProgramType";

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "departments" (
    "department_id" SERIAL NOT NULL,
    "department_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "photo_url" TEXT,
    "notify_certificate" BOOLEAN NOT NULL DEFAULT false,
    "notify_course" BOOLEAN NOT NULL DEFAULT true,
    "notify_deadline" BOOLEAN NOT NULL DEFAULT true,
    "default_report_format" TEXT NOT NULL DEFAULT 'pdf',
    "report_include_department_stats" BOOLEAN NOT NULL DEFAULT true,
    "report_include_employee_details" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "program_proposals" (
    "proposal_id" SERIAL NOT NULL,
    "submitted_by" INTEGER NOT NULL,
    "approved_by" INTEGER,
    "proposal_title" TEXT NOT NULL,
    "description" TEXT,
    "submitted_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approval_date" TIMESTAMP(3),
    "status" "ProposalStatus" NOT NULL DEFAULT 'pending',
    "department_id" INTEGER,
    "review_note" TEXT,

    CONSTRAINT "program_proposals_pkey" PRIMARY KEY ("proposal_id")
);

-- CreateTable
CREATE TABLE "training_programs" (
    "program_id" SERIAL NOT NULL,
    "proposal_id" INTEGER,
    "department_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "program_name" TEXT NOT NULL,
    "description" TEXT,
    "program_type" "ProgramType" NOT NULL,
    "status" "ProgramStatus" NOT NULL DEFAULT 'draft',
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "course_requests" (
    "request_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" INTEGER,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "course_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "course_title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approval_status" "CourseApprovalStatus" NOT NULL DEFAULT 'draft',

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "learning_materials" (
    "material_id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "material_title" TEXT NOT NULL,
    "material_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_materials_pkey" PRIMARY KEY ("material_id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "assessment_id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "passing_score" INTEGER NOT NULL DEFAULT 70,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("assessment_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" SERIAL NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "correct_answer" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "enrollment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_percentage" INTEGER NOT NULL DEFAULT 0,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'assigned',

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "material_progress" (
    "material_progress_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_progress_pkey" PRIMARY KEY ("material_progress_id")
);

-- CreateTable
CREATE TABLE "assessment_results" (
    "result_id" SERIAL NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "completed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_results_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "certificate_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_url" TEXT,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("certificate_id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" INTEGER,
    "description" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_name_key" ON "departments"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "users_department_id_idx" ON "users"("department_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "program_proposals_submitted_by_idx" ON "program_proposals"("submitted_by");

-- CreateIndex
CREATE INDEX "program_proposals_department_id_idx" ON "program_proposals"("department_id");

-- CreateIndex
CREATE INDEX "program_proposals_status_idx" ON "program_proposals"("status");

-- CreateIndex
CREATE INDEX "training_programs_proposal_id_idx" ON "training_programs"("proposal_id");

-- CreateIndex
CREATE INDEX "training_programs_department_id_idx" ON "training_programs"("department_id");

-- CreateIndex
CREATE INDEX "training_programs_created_by_idx" ON "training_programs"("created_by");

-- CreateIndex
CREATE INDEX "training_programs_program_type_idx" ON "training_programs"("program_type");

-- CreateIndex
CREATE INDEX "training_programs_status_idx" ON "training_programs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "course_requests_course_id_key" ON "course_requests"("course_id");

-- CreateIndex
CREATE INDEX "course_requests_program_id_idx" ON "course_requests"("program_id");

-- CreateIndex
CREATE INDEX "course_requests_requested_by_idx" ON "course_requests"("requested_by");

-- CreateIndex
CREATE INDEX "course_requests_trainer_id_idx" ON "course_requests"("trainer_id");

-- CreateIndex
CREATE INDEX "course_requests_status_idx" ON "course_requests"("status");

-- CreateIndex
CREATE INDEX "courses_program_id_idx" ON "courses"("program_id");

-- CreateIndex
CREATE INDEX "courses_trainer_id_idx" ON "courses"("trainer_id");

-- CreateIndex
CREATE INDEX "courses_approval_status_idx" ON "courses"("approval_status");

-- CreateIndex
CREATE INDEX "courses_deadline_idx" ON "courses"("deadline");

-- CreateIndex
CREATE INDEX "learning_materials_course_id_idx" ON "learning_materials"("course_id");

-- CreateIndex
CREATE INDEX "assessments_course_id_idx" ON "assessments"("course_id");

-- CreateIndex
CREATE INDEX "questions_assessment_id_idx" ON "questions"("assessment_id");

-- CreateIndex
CREATE INDEX "course_enrollments_user_id_idx" ON "course_enrollments"("user_id");

-- CreateIndex
CREATE INDEX "course_enrollments_course_id_idx" ON "course_enrollments"("course_id");

-- CreateIndex
CREATE INDEX "course_enrollments_status_idx" ON "course_enrollments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_user_id_course_id_key" ON "course_enrollments"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "material_progress_material_id_idx" ON "material_progress"("material_id");

-- CreateIndex
CREATE INDEX "material_progress_user_id_idx" ON "material_progress"("user_id");

-- CreateIndex
CREATE INDEX "material_progress_completed_idx" ON "material_progress"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "material_progress_user_id_material_id_key" ON "material_progress"("user_id", "material_id");

-- CreateIndex
CREATE INDEX "assessment_results_assessment_id_idx" ON "assessment_results"("assessment_id");

-- CreateIndex
CREATE INDEX "assessment_results_user_id_idx" ON "assessment_results"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_results_assessment_id_user_id_key" ON "assessment_results"("assessment_id", "user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_date_idx" ON "notifications"("created_date");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");

-- CreateIndex
CREATE INDEX "certificates_user_id_idx" ON "certificates"("user_id");

-- CreateIndex
CREATE INDEX "certificates_course_id_idx" ON "certificates"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_user_id_course_id_key" ON "certificates"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

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

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_proposals" ADD CONSTRAINT "program_proposals_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_proposals" ADD CONSTRAINT "program_proposals_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_proposals" ADD CONSTRAINT "program_proposals_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_programs" ADD CONSTRAINT "training_programs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_programs" ADD CONSTRAINT "training_programs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_programs" ADD CONSTRAINT "training_programs_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "program_proposals"("proposal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "training_programs"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "training_programs"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_progress" ADD CONSTRAINT "material_progress_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "learning_materials"("material_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_progress" ADD CONSTRAINT "material_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("badge_id") ON DELETE CASCADE ON UPDATE CASCADE;


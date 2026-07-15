-- AlterTable
ALTER TABLE "course_requests" ADD COLUMN     "course_id" INTEGER;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "assessment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE SET NULL ON UPDATE CASCADE;

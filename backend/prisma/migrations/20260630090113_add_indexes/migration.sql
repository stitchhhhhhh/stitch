-- CreateIndex
CREATE INDEX "assessment_results_assessment_id_idx" ON "assessment_results"("assessment_id");

-- CreateIndex
CREATE INDEX "assessment_results_user_id_idx" ON "assessment_results"("user_id");

-- CreateIndex
CREATE INDEX "assessments_course_id_idx" ON "assessments"("course_id");

-- CreateIndex
CREATE INDEX "certificates_user_id_idx" ON "certificates"("user_id");

-- CreateIndex
CREATE INDEX "certificates_course_id_idx" ON "certificates"("course_id");

-- CreateIndex
CREATE INDEX "course_enrollments_user_id_idx" ON "course_enrollments"("user_id");

-- CreateIndex
CREATE INDEX "course_enrollments_course_id_idx" ON "course_enrollments"("course_id");

-- CreateIndex
CREATE INDEX "course_requests_program_id_idx" ON "course_requests"("program_id");

-- CreateIndex
CREATE INDEX "course_requests_trainer_id_idx" ON "course_requests"("trainer_id");

-- CreateIndex
CREATE INDEX "courses_program_id_idx" ON "courses"("program_id");

-- CreateIndex
CREATE INDEX "courses_trainer_id_idx" ON "courses"("trainer_id");

-- CreateIndex
CREATE INDEX "learning_materials_course_id_idx" ON "learning_materials"("course_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "program_proposals_submitted_by_idx" ON "program_proposals"("submitted_by");

-- CreateIndex
CREATE INDEX "program_proposals_status_idx" ON "program_proposals"("status");

-- CreateIndex
CREATE INDEX "questions_assessment_id_idx" ON "questions"("assessment_id");

-- CreateIndex
CREATE INDEX "training_programs_department_id_idx" ON "training_programs"("department_id");

-- CreateIndex
CREATE INDEX "training_programs_created_by_idx" ON "training_programs"("created_by");

-- CreateIndex
CREATE INDEX "users_department_id_idx" ON "users"("department_id");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

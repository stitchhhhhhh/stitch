ALTER TABLE "courses"
ADD COLUMN IF NOT EXISTS "assessment_id" INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'courses_assessment_id_fkey'
  ) THEN
    ALTER TABLE "courses"
    ADD CONSTRAINT "courses_assessment_id_fkey"
    FOREIGN KEY ("assessment_id")
    REFERENCES "assessments"("assessment_id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END
$$;

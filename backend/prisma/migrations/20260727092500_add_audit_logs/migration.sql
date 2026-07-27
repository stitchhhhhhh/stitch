CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" INTEGER,
    "description" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx"
ON "audit_logs"("user_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'audit_logs_user_id_fkey'
          AND conrelid = '"audit_logs"'::regclass
    ) THEN
        ALTER TABLE "audit_logs"
        ADD CONSTRAINT "audit_logs_user_id_fkey"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("user_id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;
END
$$;

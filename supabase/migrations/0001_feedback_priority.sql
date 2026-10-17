ALTER TABLE "feedback"
ADD COLUMN IF NOT EXISTS "priority" text NOT NULL DEFAULT 'Medium';

CREATE TABLE IF NOT EXISTS "library_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"category" text NOT NULL,
	"available" boolean DEFAULT true,
	"return_date" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timetable" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" text NOT NULL,
	"subject" text NOT NULL,
	"time" text NOT NULL,
	"end_time" text NOT NULL,
	"room" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "priority" text DEFAULT 'Medium' NOT NULL;
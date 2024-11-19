CREATE TABLE IF NOT EXISTS "levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL,
	"subject_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(30) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_url" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "name" varchar(50) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels" ADD CONSTRAINT "levels_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TYPE "public"."weekdays" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tutors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tutors_availabilities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tutor_id" uuid NOT NULL,
	"weekday" "weekdays" NOT NULL,
	"morning" boolean DEFAULT false NOT NULL,
	"afternoon" boolean DEFAULT false NOT NULL,
	"evening" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tutors_services" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tutor_id" uuid NOT NULL,
	"level_id" uuid NOT NULL,
	"price" numeric(4, 2) NOT NULL,
	CONSTRAINT "price_check" CHECK ("tutors_services"."price" > 5 AND "tutors_services"."price" < 100)
);
--> statement-breakpoint
ALTER TABLE "tutors_services" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "avatar_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutors" ADD CONSTRAINT "tutors_id_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutors" ADD CONSTRAINT "tutors_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutors_availabilities" ADD CONSTRAINT "tutors_availabilities_tutor_id_tutors_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutors_services" ADD CONSTRAINT "tutors_services_tutor_id_tutors_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tutors_services" ADD CONSTRAINT "tutors_services_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE POLICY "tutor_insert_policy" ON "tutors_services" AS PERMISSIVE FOR INSERT TO "authenticated" USING (tutors_services.tutor_id = auth.uid()) WITH CHECK (tutors_services.tutor_id = auth.uid());--> statement-breakpoint
CREATE POLICY "tutor_update_policy" ON "tutors_services" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (tutors_services.tutor_id = auth.uid()) WITH CHECK (tutors_services.tutor_id = auth.uid());--> statement-breakpoint
CREATE POLICY "tutor_delete_policy" ON "tutors_services" AS PERMISSIVE FOR DELETE TO "authenticated" USING (tutors_services.tutor_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated_select_policy" ON "tutors_services" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);
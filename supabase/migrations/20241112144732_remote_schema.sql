create sequence "public"."conversations_id_seq";

create sequence "public"."levels_id_seq";

create sequence "public"."messages_id_seq";

create sequence "public"."subjects_id_seq";

create sequence "public"."tutors_availabilities_id_seq";

create sequence "public"."tutors_services_id_seq";

create table "public"."conversations" (
    "id" integer not null default nextval('conversations_id_seq'::regclass),
    "from_profile_id" uuid,
    "to_profile_id" uuid,
    "last_message" text,
    "last_message_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone default now()
);


create table "public"."levels" (
    "id" integer not null default nextval('levels_id_seq'::regclass),
    "subject_id" integer not null,
    "name" text not null
);


alter table "public"."levels" enable row level security;

create table "public"."messages" (
    "id" integer not null default nextval('messages_id_seq'::regclass),
    "conversation_id" integer,
    "from_profile_id" uuid,
    "content" text not null,
    "created_at" timestamp with time zone default now(),
    "is_read" boolean not null default false
);


create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "avatar" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "last_active" timestamp with time zone
);


alter table "public"."profiles" enable row level security;

create table "public"."subjects" (
    "id" integer not null default nextval('subjects_id_seq'::regclass),
    "name" text not null
);


alter table "public"."subjects" enable row level security;

create table "public"."tutors" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid not null,
    "metadata" jsonb not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."tutors" enable row level security;

create table "public"."tutors_availabilities" (
    "id" integer not null default nextval('tutors_availabilities_id_seq'::regclass),
    "tutor_id" uuid not null,
    "weekday" text not null,
    "morning" boolean not null default false,
    "afternoon" boolean not null default false,
    "evening" boolean not null default false
);


alter table "public"."tutors_availabilities" enable row level security;

create table "public"."tutors_services" (
    "id" integer not null default nextval('tutors_services_id_seq'::regclass),
    "tutor_id" uuid not null,
    "level_id" integer not null,
    "price" numeric(5,2) not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."tutors_services" enable row level security;

create table "public"."user_sessions" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "last_active" timestamp with time zone not null default now()
);


alter sequence "public"."conversations_id_seq" owned by "public"."conversations"."id";

alter sequence "public"."levels_id_seq" owned by "public"."levels"."id";

alter sequence "public"."messages_id_seq" owned by "public"."messages"."id";

alter sequence "public"."subjects_id_seq" owned by "public"."subjects"."id";

alter sequence "public"."tutors_availabilities_id_seq" owned by "public"."tutors_availabilities"."id";

alter sequence "public"."tutors_services_id_seq" owned by "public"."tutors_services"."id";

CREATE UNIQUE INDEX conversations_pkey ON public.conversations USING btree (id);

CREATE INDEX idx_conversations_from_profile_id ON public.conversations USING btree (from_profile_id);

CREATE INDEX idx_conversations_to_profile_id ON public.conversations USING btree (to_profile_id);

CREATE INDEX idx_levels_id_subject_id ON public.levels USING btree (id, subject_id);

CREATE INDEX idx_messages_conversation_id ON public.messages USING btree (conversation_id);

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at);

CREATE INDEX idx_messages_from_profile_id ON public.messages USING btree (from_profile_id);

CREATE INDEX idx_profiles_id ON public.profiles USING btree (id);

CREATE INDEX idx_subjects_id ON public.subjects USING btree (id);

CREATE INDEX idx_tutors_availabilities_tutor_id ON public.tutors_availabilities USING btree (tutor_id);

CREATE INDEX idx_tutors_services_tutor_id ON public.tutors_services USING btree (tutor_id);

CREATE INDEX idx_user_sessions_last_active ON public.user_sessions USING btree (last_active);

CREATE UNIQUE INDEX levels_pkey ON public.levels USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX subjects_name_key ON public.subjects USING btree (name);

CREATE UNIQUE INDEX subjects_pkey ON public.subjects USING btree (id);

CREATE UNIQUE INDEX tutors_availabilities_pkey ON public.tutors_availabilities USING btree (id);

CREATE UNIQUE INDEX tutors_pkey ON public.tutors USING btree (id);

CREATE UNIQUE INDEX tutors_services_pkey ON public.tutors_services USING btree (id);

CREATE UNIQUE INDEX user_sessions_pkey ON public.user_sessions USING btree (id);

CREATE UNIQUE INDEX user_sessions_user_id_key ON public.user_sessions USING btree (user_id);

alter table "public"."conversations" add constraint "conversations_pkey" PRIMARY KEY using index "conversations_pkey";

alter table "public"."levels" add constraint "levels_pkey" PRIMARY KEY using index "levels_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."subjects" add constraint "subjects_pkey" PRIMARY KEY using index "subjects_pkey";

alter table "public"."tutors" add constraint "tutors_pkey" PRIMARY KEY using index "tutors_pkey";

alter table "public"."tutors_availabilities" add constraint "tutors_availabilities_pkey" PRIMARY KEY using index "tutors_availabilities_pkey";

alter table "public"."tutors_services" add constraint "tutors_services_pkey" PRIMARY KEY using index "tutors_services_pkey";

alter table "public"."user_sessions" add constraint "user_sessions_pkey" PRIMARY KEY using index "user_sessions_pkey";

alter table "public"."conversations" add constraint "conversations_from_profile_id_fkey" FOREIGN KEY (from_profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_from_profile_id_fkey";

alter table "public"."conversations" add constraint "conversations_to_profile_id_fkey" FOREIGN KEY (to_profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_to_profile_id_fkey";

alter table "public"."levels" add constraint "levels_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE not valid;

alter table "public"."levels" validate constraint "levels_subject_id_fkey";

alter table "public"."messages" add constraint "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_conversation_id_fkey";

alter table "public"."messages" add constraint "messages_from_profile_id_fkey" FOREIGN KEY (from_profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_from_profile_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."subjects" add constraint "subjects_name_key" UNIQUE using index "subjects_name_key";

alter table "public"."tutors" add constraint "tutors_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."tutors" validate constraint "tutors_profile_id_fkey";

alter table "public"."tutors_availabilities" add constraint "tutors_availabilities_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE not valid;

alter table "public"."tutors_availabilities" validate constraint "tutors_availabilities_tutor_id_fkey";

alter table "public"."tutors_availabilities" add constraint "tutors_availabilities_weekday_check" CHECK ((weekday = ANY (ARRAY['Monday'::text, 'Tuesday'::text, 'Wednesday'::text, 'Thursday'::text, 'Friday'::text, 'Saturday'::text, 'Sunday'::text]))) not valid;

alter table "public"."tutors_availabilities" validate constraint "tutors_availabilities_weekday_check";

alter table "public"."tutors_services" add constraint "tutors_services_level_id_fkey" FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE not valid;

alter table "public"."tutors_services" validate constraint "tutors_services_level_id_fkey";

alter table "public"."tutors_services" add constraint "tutors_services_price_check" CHECK (((price >= (5)::numeric) AND (price <= (100)::numeric))) not valid;

alter table "public"."tutors_services" validate constraint "tutors_services_price_check";

alter table "public"."tutors_services" add constraint "tutors_services_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE not valid;

alter table "public"."tutors_services" validate constraint "tutors_services_tutor_id_fkey";

alter table "public"."user_sessions" add constraint "user_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_sessions" validate constraint "user_sessions_user_id_fkey";

alter table "public"."user_sessions" add constraint "user_sessions_user_id_key" UNIQUE using index "user_sessions_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (id, name, avatar, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'avatar', ''),
        now(),
        now()
    );
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    UPDATE public.profiles
    SET name = COALESCE(NEW.raw_user_meta_data ->> 'name', name),
        avatar = COALESCE(NEW.raw_user_meta_data ->> 'avatar', avatar),
        updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_user_online(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  session_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_sessions
    WHERE user_id = p_user_id
      AND last_active > (now() - interval '5 minutes')
  ) INTO session_exists;
  
  RETURN session_exists;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_last_active()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.last_active = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_status_and_last_active()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only update last_active if online_status is changing to true or if last_active is null
  IF (TG_OP = 'UPDATE' AND NEW.online_status = true) OR (TG_OP = 'UPDATE' AND NEW.last_active IS NULL) THEN
    NEW.last_active = now();
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_user_session(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO user_sessions (user_id, last_active)
  VALUES (p_user_id, now())
  ON CONFLICT (user_id)
  DO UPDATE SET last_active = now();
END;
$function$
;

grant delete on table "public"."conversations" to "anon";

grant insert on table "public"."conversations" to "anon";

grant references on table "public"."conversations" to "anon";

grant select on table "public"."conversations" to "anon";

grant trigger on table "public"."conversations" to "anon";

grant truncate on table "public"."conversations" to "anon";

grant update on table "public"."conversations" to "anon";

grant delete on table "public"."conversations" to "authenticated";

grant insert on table "public"."conversations" to "authenticated";

grant references on table "public"."conversations" to "authenticated";

grant select on table "public"."conversations" to "authenticated";

grant trigger on table "public"."conversations" to "authenticated";

grant truncate on table "public"."conversations" to "authenticated";

grant update on table "public"."conversations" to "authenticated";

grant delete on table "public"."conversations" to "service_role";

grant insert on table "public"."conversations" to "service_role";

grant references on table "public"."conversations" to "service_role";

grant select on table "public"."conversations" to "service_role";

grant trigger on table "public"."conversations" to "service_role";

grant truncate on table "public"."conversations" to "service_role";

grant update on table "public"."conversations" to "service_role";

grant delete on table "public"."levels" to "anon";

grant insert on table "public"."levels" to "anon";

grant references on table "public"."levels" to "anon";

grant select on table "public"."levels" to "anon";

grant trigger on table "public"."levels" to "anon";

grant truncate on table "public"."levels" to "anon";

grant update on table "public"."levels" to "anon";

grant delete on table "public"."levels" to "authenticated";

grant insert on table "public"."levels" to "authenticated";

grant references on table "public"."levels" to "authenticated";

grant select on table "public"."levels" to "authenticated";

grant trigger on table "public"."levels" to "authenticated";

grant truncate on table "public"."levels" to "authenticated";

grant update on table "public"."levels" to "authenticated";

grant delete on table "public"."levels" to "service_role";

grant insert on table "public"."levels" to "service_role";

grant references on table "public"."levels" to "service_role";

grant select on table "public"."levels" to "service_role";

grant trigger on table "public"."levels" to "service_role";

grant truncate on table "public"."levels" to "service_role";

grant update on table "public"."levels" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."subjects" to "anon";

grant insert on table "public"."subjects" to "anon";

grant references on table "public"."subjects" to "anon";

grant select on table "public"."subjects" to "anon";

grant trigger on table "public"."subjects" to "anon";

grant truncate on table "public"."subjects" to "anon";

grant update on table "public"."subjects" to "anon";

grant delete on table "public"."subjects" to "authenticated";

grant insert on table "public"."subjects" to "authenticated";

grant references on table "public"."subjects" to "authenticated";

grant select on table "public"."subjects" to "authenticated";

grant trigger on table "public"."subjects" to "authenticated";

grant truncate on table "public"."subjects" to "authenticated";

grant update on table "public"."subjects" to "authenticated";

grant delete on table "public"."subjects" to "service_role";

grant insert on table "public"."subjects" to "service_role";

grant references on table "public"."subjects" to "service_role";

grant select on table "public"."subjects" to "service_role";

grant trigger on table "public"."subjects" to "service_role";

grant truncate on table "public"."subjects" to "service_role";

grant update on table "public"."subjects" to "service_role";

grant delete on table "public"."tutors" to "anon";

grant insert on table "public"."tutors" to "anon";

grant references on table "public"."tutors" to "anon";

grant select on table "public"."tutors" to "anon";

grant trigger on table "public"."tutors" to "anon";

grant truncate on table "public"."tutors" to "anon";

grant update on table "public"."tutors" to "anon";

grant delete on table "public"."tutors" to "authenticated";

grant insert on table "public"."tutors" to "authenticated";

grant references on table "public"."tutors" to "authenticated";

grant select on table "public"."tutors" to "authenticated";

grant trigger on table "public"."tutors" to "authenticated";

grant truncate on table "public"."tutors" to "authenticated";

grant update on table "public"."tutors" to "authenticated";

grant delete on table "public"."tutors" to "service_role";

grant insert on table "public"."tutors" to "service_role";

grant references on table "public"."tutors" to "service_role";

grant select on table "public"."tutors" to "service_role";

grant trigger on table "public"."tutors" to "service_role";

grant truncate on table "public"."tutors" to "service_role";

grant update on table "public"."tutors" to "service_role";

grant delete on table "public"."tutors_availabilities" to "anon";

grant insert on table "public"."tutors_availabilities" to "anon";

grant references on table "public"."tutors_availabilities" to "anon";

grant select on table "public"."tutors_availabilities" to "anon";

grant trigger on table "public"."tutors_availabilities" to "anon";

grant truncate on table "public"."tutors_availabilities" to "anon";

grant update on table "public"."tutors_availabilities" to "anon";

grant delete on table "public"."tutors_availabilities" to "authenticated";

grant insert on table "public"."tutors_availabilities" to "authenticated";

grant references on table "public"."tutors_availabilities" to "authenticated";

grant select on table "public"."tutors_availabilities" to "authenticated";

grant trigger on table "public"."tutors_availabilities" to "authenticated";

grant truncate on table "public"."tutors_availabilities" to "authenticated";

grant update on table "public"."tutors_availabilities" to "authenticated";

grant delete on table "public"."tutors_availabilities" to "service_role";

grant insert on table "public"."tutors_availabilities" to "service_role";

grant references on table "public"."tutors_availabilities" to "service_role";

grant select on table "public"."tutors_availabilities" to "service_role";

grant trigger on table "public"."tutors_availabilities" to "service_role";

grant truncate on table "public"."tutors_availabilities" to "service_role";

grant update on table "public"."tutors_availabilities" to "service_role";

grant delete on table "public"."tutors_services" to "anon";

grant insert on table "public"."tutors_services" to "anon";

grant references on table "public"."tutors_services" to "anon";

grant select on table "public"."tutors_services" to "anon";

grant trigger on table "public"."tutors_services" to "anon";

grant truncate on table "public"."tutors_services" to "anon";

grant update on table "public"."tutors_services" to "anon";

grant delete on table "public"."tutors_services" to "authenticated";

grant insert on table "public"."tutors_services" to "authenticated";

grant references on table "public"."tutors_services" to "authenticated";

grant select on table "public"."tutors_services" to "authenticated";

grant trigger on table "public"."tutors_services" to "authenticated";

grant truncate on table "public"."tutors_services" to "authenticated";

grant update on table "public"."tutors_services" to "authenticated";

grant delete on table "public"."tutors_services" to "service_role";

grant insert on table "public"."tutors_services" to "service_role";

grant references on table "public"."tutors_services" to "service_role";

grant select on table "public"."tutors_services" to "service_role";

grant trigger on table "public"."tutors_services" to "service_role";

grant truncate on table "public"."tutors_services" to "service_role";

grant update on table "public"."tutors_services" to "service_role";

grant delete on table "public"."user_sessions" to "anon";

grant insert on table "public"."user_sessions" to "anon";

grant references on table "public"."user_sessions" to "anon";

grant select on table "public"."user_sessions" to "anon";

grant trigger on table "public"."user_sessions" to "anon";

grant truncate on table "public"."user_sessions" to "anon";

grant update on table "public"."user_sessions" to "anon";

grant delete on table "public"."user_sessions" to "authenticated";

grant insert on table "public"."user_sessions" to "authenticated";

grant references on table "public"."user_sessions" to "authenticated";

grant select on table "public"."user_sessions" to "authenticated";

grant trigger on table "public"."user_sessions" to "authenticated";

grant truncate on table "public"."user_sessions" to "authenticated";

grant update on table "public"."user_sessions" to "authenticated";

grant delete on table "public"."user_sessions" to "service_role";

grant insert on table "public"."user_sessions" to "service_role";

grant references on table "public"."user_sessions" to "service_role";

grant select on table "public"."user_sessions" to "service_role";

grant trigger on table "public"."user_sessions" to "service_role";

grant truncate on table "public"."user_sessions" to "service_role";

grant update on table "public"."user_sessions" to "service_role";

create policy "allow_conversation_insert"
on "public"."conversations"
as permissive
for insert
to public
with check (((from_profile_id = auth.uid()) OR (to_profile_id = auth.uid())));


create policy "conversations_participants_can_insert"
on "public"."conversations"
as permissive
for insert
to public
with check (((from_profile_id = auth.uid()) OR (to_profile_id = auth.uid())));


create policy "conversations_participants_can_select"
on "public"."conversations"
as permissive
for select
to public
using (((from_profile_id = auth.uid()) OR (to_profile_id = auth.uid())));


create policy "conversations_participants_can_update"
on "public"."conversations"
as permissive
for update
to public
using (((from_profile_id = auth.uid()) OR (to_profile_id = auth.uid())));


create policy "Disable delete access for all users"
on "public"."levels"
as permissive
for delete
to public
using (false);


create policy "Disable insert access for all users"
on "public"."levels"
as permissive
for insert
to public
with check (false);


create policy "Disable update access for all users"
on "public"."levels"
as permissive
for update
to public
using (false)
with check (false);


create policy "Enable read access for authenticated users"
on "public"."levels"
as permissive
for select
to authenticated
using (true);


create policy "messages_sender_can_insert"
on "public"."messages"
as permissive
for insert
to public
with check (((from_profile_id = auth.uid()) AND (conversation_id IN ( SELECT conversations.id
   FROM conversations
  WHERE ((conversations.from_profile_id = auth.uid()) OR (conversations.to_profile_id = auth.uid()))))));


create policy "messages_sender_or_participants_can_select"
on "public"."messages"
as permissive
for select
to public
using (((from_profile_id = auth.uid()) OR (conversation_id IN ( SELECT conversations.id
   FROM conversations
  WHERE ((conversations.from_profile_id = auth.uid()) OR (conversations.to_profile_id = auth.uid()))))));


create policy "messages_sender_or_participants_can_update"
on "public"."messages"
as permissive
for update
to public
using (((from_profile_id = auth.uid()) OR (conversation_id IN ( SELECT conversations.id
   FROM conversations
  WHERE ((conversations.from_profile_id = auth.uid()) OR (conversations.to_profile_id = auth.uid()))))));


create policy "Allow user to update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Disable delete access for all users"
on "public"."subjects"
as permissive
for delete
to public
using (false);


create policy "Disable insert access for all users"
on "public"."subjects"
as permissive
for insert
to public
with check (false);


create policy "Disable update access for all users"
on "public"."subjects"
as permissive
for update
to public
using (false)
with check (false);


create policy "Enable read access for authenticated users"
on "public"."subjects"
as permissive
for select
to authenticated
using (true);


create policy "Disable delete access for all users"
on "public"."tutors"
as permissive
for delete
to public
using (false);


create policy "Disable insert access for all users"
on "public"."tutors"
as permissive
for insert
to public
with check (false);


create policy "Disable update access for all users"
on "public"."tutors"
as permissive
for update
to public
using (false)
with check (false);


create policy "Enable read access for all users"
on "public"."tutors"
as permissive
for all
to public
using (true);


create policy "Enable read access for authenticated users"
on "public"."tutors"
as permissive
for select
to authenticated
using (true);


create policy "Disable delete access for all users"
on "public"."tutors_availabilities"
as permissive
for delete
to public
using (false);


create policy "Disable insert access for all users"
on "public"."tutors_availabilities"
as permissive
for insert
to public
with check (false);


create policy "Disable update access for all users"
on "public"."tutors_availabilities"
as permissive
for update
to public
using (false)
with check (false);


create policy "Enable read access for authenticated users"
on "public"."tutors_availabilities"
as permissive
for select
to authenticated
using (true);


create policy "Disable delete access for all users"
on "public"."tutors_services"
as permissive
for delete
to public
using (false);


create policy "Disable insert access for all users"
on "public"."tutors_services"
as permissive
for insert
to public
with check (false);


create policy "Disable update access for all users"
on "public"."tutors_services"
as permissive
for update
to public
using (false)
with check (false);


create policy "Enable read access for authenticated users"
on "public"."tutors_services"
as permissive
for select
to authenticated
using (true);




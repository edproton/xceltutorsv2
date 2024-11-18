"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { Level, SubjectWithLevels, TutorInfo } from "./types";
import { redirect } from "next/navigation";

async function getTutorWithGroupedServices(
  supabase: DbSupabaseClient,
  tutorId: string
): Promise<TutorInfo> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error(`Failed to fetch user data: ${userError?.message}`);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to fetch profile data: ${profileError.message}`);
  }

  const { data, error } = await supabase
    .from("tutors")
    .select(
      `
      id,
      profiles (name, avatar),
      tutors_services (
        levels (
          id,
          name,
          subjects (name)
        )
      )
    `
    )
    .eq("id", tutorId)
    .single<{
      id: string;
      profiles: { name: string; avatar: string };
      tutors_services: {
        levels: {
          id: number;
          name: string;
          subjects: { name: string } | { name: string }[];
        };
      }[];
    }>();

  if (error) {
    throw new Error(`Failed to fetch tutor data: ${error.message}`);
  }

  if (!data) {
    throw new Error(`No tutor found with id: ${tutorId}`);
  }

  // Create a map to group subjects and levels
  const subjectMap = new Map<string, Set<Level>>();

  data.tutors_services.forEach((service) => {
    const level = service.levels;
    if (level && level.subjects) {
      // Handle the case where subjects is a single object
      const subjectArray = Array.isArray(level.subjects)
        ? level.subjects
        : [level.subjects];
      subjectArray.forEach((subject) => {
        if (!subjectMap.has(subject.name)) {
          subjectMap.set(subject.name, new Set());
        }
        subjectMap.get(subject.name)!.add({ id: level.id, name: level.name });
      });
    }
  });

  // Convert the map to the desired structure
  const subjects: SubjectWithLevels[] = Array.from(subjectMap.entries()).map(
    ([name, levelSet]) => ({
      name,
      levels: Array.from(levelSet),
    })
  );

  const { data: freeBookingData, error: freeBookingError } = await supabase
    .from("bookings")
    .select("id")
    .eq("tutor_id", tutorId)
    .eq("created_by_profile_id", profileData.id)
    .eq("type", "Free Meeting")
    .maybeSingle();

  if (freeBookingError) {
    throw new Error(
      `Failed to get free booking data: ${freeBookingError.message}`
    );
  }

  if (freeBookingData) {
    redirect(`/view-tutors/${tutorId}`);
  }

  return {
    id: data.id,
    name: data.profiles?.name ?? "Unknown Tutor",
    avatar: data.profiles?.avatar ?? "",
    subjects: subjects,
  };
}

export async function getTutorWithGroupedServicesCached(
  tutorId: string
): Promise<TutorInfo> {
  const supabase = await createClient();

  return unstable_cache(
    () => getTutorWithGroupedServices(supabase, tutorId),
    [`tutor-${tutorId}`]
  )();
}

"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { Level, SubjectWithLevels, TutorInfo } from "./types";

async function getTutorWithGroupedServices(
  supabase: DbSupabaseClient,
  tutorId: string
): Promise<TutorInfo> {
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

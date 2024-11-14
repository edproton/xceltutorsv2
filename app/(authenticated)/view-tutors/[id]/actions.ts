"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { TutorWithAvailabilityAndServices } from "./types";

async function getTutorById(
  supabase: DbSupabaseClient,
  id: string
): Promise<TutorWithAvailabilityAndServices> {
  // Step 1: Fetch tutor data with related profiles, services, and availabilities
  const tutorQuery = await supabase
    .from("tutors")
    .select(
      `
      id,
      metadata,
      profiles (name, avatar),
      tutors_services (
        price,
        levels (name, subjects (name))
      ),
      tutors_availabilities (weekday, morning, afternoon, evening)
    `
    )
    .eq("id", id)
    .single();

  if (tutorQuery.error) {
    throw new Error(`Failed to fetch data: ${tutorQuery.error.message}`);
  }

  const response = tutorQuery.data;

  if (!response) {
    throw new Error(`Tutor with id ${id} not found`);
  }

  const metadata = response.metadata as {
    bio: {
      full: string;
      short: string;
      session: string;
    };
    tags: string[];
    degree: string;
    grades: Array<{
      grade: string;
      level: string;
      subject: string;
    }>;
    reviews: number;
    university: string;
    completed_lessons: number;
    trusted_by_schools: boolean;
  };

  // Map the response to the expected structure
  const tutorWithDetails: TutorWithAvailabilityAndServices = {
    id: response.id,
    name: response.profiles?.name ?? "Unknown Tutor",
    avatar: response.profiles?.avatar ?? "",
    metadata: {
      bio: {
        full: metadata.bio?.full ?? "",
        short: metadata.bio?.short ?? "",
        session: metadata.bio?.session ?? "",
      },
      completedLessons: metadata.completed_lessons ?? 0,
      reviews: metadata.reviews ?? 0,
      tags: metadata.tags ?? [],
      trustedBySchools: metadata.trusted_by_schools ?? false,
      degree: metadata.degree ?? "",
      grades:
        metadata.grades?.map((grade) => ({
          grade: grade.grade,
          level: grade.level,
          subject: grade.subject,
        })) ?? [],
      university: metadata.university ?? "",
    },
    services: response.tutors_services.map((service) => ({
      subject: service.levels?.subjects?.name ?? "Unknown Subject",
      level: service.levels?.name ?? "Unknown Level",
      price: service.price,
    })),
    availabilities: response.tutors_availabilities.map((availability) => ({
      weekday: availability.weekday,
      morning: availability.morning,
      afternoon: availability.afternoon,
      evening: availability.evening,
    })),
  };

  return tutorWithDetails;
}

export async function getTutorByIdCached(
  id: string
): Promise<TutorWithAvailabilityAndServices> {
  const supabase = await createClient();

  return unstable_cache(() => getTutorById(supabase, id), [`tutor-${id}`])();
}

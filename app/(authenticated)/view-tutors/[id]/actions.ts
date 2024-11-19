"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import {
  profiles,
  tutors,
  tutorsAvailabilities,
  tutorsServices,
} from "@/supabase/migrations/schema";
import { db } from "@/lib/database";
import { levelsTable, subjectsTable } from "@/lib/database/schemas";

type TutorWithAvailabilityAndServices = {
  id: string;
  name: string;
  avatar: string;
  hasAlreadyBeenContacted: boolean;
  metadata: {
    bio: {
      full: string;
      short: string;
      session: string;
    };
    completedLessons: number;
    reviews: number;
    tags: string[];
    trustedBySchools: boolean;
    degree: string;
    grades: {
      grade: string;
      level: string;
      subject: string;
    }[];
    university: string;
  };
  services: {
    subject: string;
    level: string;
    price: number;
  }[];
  availabilities: {
    weekday: string;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  }[];
};

async function getTutorById(
  tutorId: string,
  profileId: string
): Promise<TutorWithAvailabilityAndServices> {
  // Step 1: Fetch tutor details
  const tutorData = await db
    .select({
      id: tutors.id,
      metadata: tutors.metadata,
      name: profiles.name,
      avatarUrl: profiles.avatarUrl,
      services: sql<
        {
          price: number;
          level: string;
          subject: string;
        }[]
      >`
      json_agg(
        json_build_object(
          'price', service.price,
          'level', service.level_name,
          'subject', service.subject_name
        )
        ORDER BY service.level_name
      ) AS services
    `,
      availabilities: sql<
        {
          weekday: string;
          morning: boolean;
          afternoon: boolean;
          evening: boolean;
        }[]
      >`
      json_agg(
        json_build_object(
          'weekday', availability.weekday,
          'morning', availability.morning,
          'afternoon', availability.afternoon,
          'evening', availability.evening
        ) ORDER BY availability.weekday
      )
    `.as("availabilities"),
    })
    .from(tutors)
    .leftJoin(profiles, eq(tutors.profileId, profiles.id))
    .leftJoin(
      sql`
    (
      SELECT
        ts.tutor_id,
        ts.price,
        l.name AS level_name,
        s.name AS subject_name
      FROM tutors_services ts
      LEFT JOIN levels l ON ts.level_id = l.id
      LEFT JOIN subjects s ON l.subject_id = s.id
    ) AS service`,
      eq(tutors.id, sql`service.tutor_id`)
    )
    .leftJoin(
      sql`
    (
      SELECT
        ta.tutor_id,
        ta.weekday,
        ta.morning,
        ta.afternoon,
        ta.evening
      FROM tutors_availabilities ta
    ) AS availability`,
      eq(tutors.id, sql`availability.tutor_id`)
    )
    .where(eq(tutors.id, tutorId))
    .groupBy(tutors.id, profiles.name, profiles.avatarUrl, tutors.metadata)
    .then((rows) => rows[0]); // Since we're fetching a single tutor

  if (!tutorData) {
    throw new Error(`Tutor with id ${tutorId} not found.`);
  }

  console.log(tutorData);
  // Step 2: Check if the user has already contacted the tutor
  const freeBookingExists = await db
    .select({
      id: bookings.id,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.tutorId, tutorId),
        eq(bookings.createdByProfileId, profileId),
        eq(bookings.type, "Free Meeting")
      )
    )
    .then((rows) => rows.length > 0);

  // Step 3: Map the data into the expected structure
  const metadata = tutorData.metadata;

  const tutorWithDetails: TutorWithAvailabilityAndServices = {
    id: tutorData.id,
    name: tutorData.name ?? "Unknown Tutor",
    avatar: tutorData.avatar ?? "",
    hasAlreadyBeenContacted: freeBookingExists,
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
    services: tutorData.services.map((service) => ({
      subject: service.levels?.subjects?.name ?? "Unknown Subject",
      level: service.levels?.name ?? "Unknown Level",
      services: tutorData.services.map((service) => ({
        subject: service.subject ?? "Unknown Subject",
        level: service.level ?? "Unknown Level",
        price: service.price,
      })),
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

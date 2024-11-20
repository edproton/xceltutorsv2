"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import {
  Availability,
  Metadata,
  Service,
  TutorWithAvailabilityAndServices,
} from "./types";
import { db } from "@/lib/database";
import { JsonValue } from "@/lib/database/types";
import { NotNull } from "kysely";

type TutorRow = {
  id: string;
  avatar: string;
  metadata: JsonValue;
  price: string;
  afternoon: boolean;
  evening: boolean;
  morning: boolean;
  weekday: string;
  tutorName: string;
  levelName: string;
  subjectName: string;
};

function mapTutorData(data: TutorRow[]): TutorWithAvailabilityAndServices {
  if (!data || data.length === 0) {
    throw new Error("No data provided");
  }

  // Initialize the tutor object
  const tutor: TutorWithAvailabilityAndServices = {
    id: data[0].id,
    name: data[0].tutorName,
    avatar: data[0].avatar,
    metadata: data[0].metadata as unknown as Metadata,
    services: [],
    availabilities: [],
    uiHelper: {
      hasAlreadyHadDemoBooking: false,
    },
  };

  // Use sets to track unique services and availabilities
  const servicesMap = new Map<string, Service>();
  const availabilitiesMap = new Map<string, Availability>();

  data.forEach((row) => {
    // Map services
    if (row.subjectName && row.levelName && row.price) {
      const serviceKey = `${row.subjectName}-${row.levelName}-${row.price}`;
      if (!servicesMap.has(serviceKey)) {
        servicesMap.set(serviceKey, {
          subject: row.subjectName,
          level: row.levelName,
          price: row.price,
        });
      }
    }

    // Map availabilities
    if (row.weekday) {
      const availabilityKey = `${row.weekday}-${row.morning}-${row.afternoon}-${row.evening}`;
      if (!availabilitiesMap.has(availabilityKey)) {
        availabilitiesMap.set(availabilityKey, {
          weekday: row.weekday,
          morning: row.morning,
          afternoon: row.afternoon,
          evening: row.evening,
        });
      }
    }
  });

  // Convert maps to arrays
  tutor.services = Array.from(servicesMap.values());
  tutor.availabilities = Array.from(availabilitiesMap.values());

  // Calculate hasMultiplePrices
  const uniquePrices = new Set(
    tutor.services.map((service) => Number(service.price))
  );
  tutor.uiHelper.multiplePrices = {
    minPrice: Math.min(...uniquePrices),
    maxPrice: Math.max(...uniquePrices),
  };

  return tutor;
}

async function getTutorById(
  supabase: DbSupabaseClient,
  id: string
): Promise<TutorWithAvailabilityAndServices> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(`Failed to fetch user data: ${userError.message}`);
  }

  const data = await db
    .selectFrom("tutors")
    .innerJoin("profiles", "profiles.id", "tutors.profileId")
    .leftJoin("tutorsServices", "tutorsServices.tutorId", "tutors.id")
    .leftJoin("levels", "levels.id", "tutorsServices.levelId")
    .leftJoin("subjects", "subjects.id", "levels.subjectId")
    .leftJoin(
      "tutorsAvailabilities",
      "tutorsAvailabilities.tutorId",
      "tutors.id"
    )
    .where("tutors.id", "=", id)
    .where("avatar", "is not", null)
    .where("tutorsServices.price", "is not", null)
    .where("levels.name", "is not", null)
    .where("subjects.name", "is not", null)
    .select([
      "tutors.id",
      "profiles.name as tutorName",
      "profiles.avatar",
      "tutors.metadata",
      "tutorsServices.price",
      "levels.name as levelName",
      "subjects.name as subjectName",
      "tutorsAvailabilities.weekday",
      "tutorsAvailabilities.morning",
      "tutorsAvailabilities.afternoon",
      "tutorsAvailabilities.evening",
    ])
    .$narrowType<{
      avatar: NotNull;
      morning: NotNull;
      afternoon: NotNull;
      evening: NotNull;
      weekday: NotNull;
      levelName: NotNull;
      subjectName: NotNull;
      price: NotNull;
    }>()
    .execute();

  const tutorProfile = mapTutorData(data);
  const freeBookingData = await db
    .selectFrom("bookings")
    .select("id")
    .where("tutorId", "=", id)
    .where("createdByProfileId", "=", user!.id)
    .where("type", "=", "Free Meeting")
    .executeTakeFirst();

  if (freeBookingData) {
    tutorProfile.uiHelper.hasAlreadyHadDemoBooking = true;
  }

  return tutorProfile;
}

export async function getTutorByIdCached(
  id: string
): Promise<TutorWithAvailabilityAndServices> {
  const supabase = await createClient();

  return getTutorById(supabase, id);
}

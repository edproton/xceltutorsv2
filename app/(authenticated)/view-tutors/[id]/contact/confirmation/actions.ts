"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { Tutor } from "./types";
import { redirect } from "next/navigation";

export const getTutorById = cache(async (tutorId: string): Promise<Tutor> => {
  const supabase = await createClient();

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
        profiles (name, avatar)
        `
    )
    .eq("id", tutorId)
    .single<{
      id: string;
      profiles: { name: string; avatar: string };
    }>();

  if (error) {
    console.error(`Failed to fetch tutor data: ${error.message}`);
    throw new Error("Failed to fetch tutor data");
  }

  if (!data) {
    throw new Error(`No tutor found with id: ${tutorId}`);
  }

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
  };
});

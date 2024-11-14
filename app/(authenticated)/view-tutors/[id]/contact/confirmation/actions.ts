"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { Tutor } from "./types";

export const getTutorById = cache(async (tutorId: string): Promise<Tutor> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tutors")
    .select(
      `
        id,
        profiles (name, avatar)
        `
    )
    .eq("id", tutorId)
    .single();

  if (error) {
    console.error(`Failed to fetch tutor data: ${error.message}`);
    throw new Error("Failed to fetch tutor data");
  }

  if (!data) {
    throw new Error(`No tutor found with id: ${tutorId}`);
  }

  return {
    id: data.id,
    name: data.profiles?.name ?? "Unknown Tutor",
    avatar: data.profiles?.avatar ?? "",
  };
});

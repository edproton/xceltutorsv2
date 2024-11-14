"use server";

import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { PageResponse, TutorWithPrices } from "./types";

async function getTutorsPaginated(
  supabase: DbSupabaseClient,
  pageNumber: number
): Promise<PageResponse<TutorWithPrices>> {
  const perPage = 5; // Fixed page size
  const offset = (pageNumber - 1) * perPage;

  // Step 1: Fetch paginated data with related profiles
  const tutorsQuery = await supabase
    .from("tutors")
    .select(
      `
      id,
      metadata,
      profiles (name, avatar),
      tutors_services (price)
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (tutorsQuery.error) {
    throw new Error(`Failed to fetch data: ${tutorsQuery.error.message}`);
  }

  // Step 2: Get total count of items
  const { count, error: countError } = await supabase
    .from("tutors")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw new Error(`Failed to fetch count: ${countError.message}`);
  }

  // Step 3: Calculate pagination metadata
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  // Type-safe data mapping
  return {
    page: pageNumber,
    perPage: perPage,
    totalItems: totalItems,
    totalPages: totalPages,
    items: tutorsQuery.data.map((item) => {
      const metadata = item.metadata as {
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

      return {
        id: item.id,
        name: item.profiles?.name ?? "Unknown Tutor",
        avatar: item.profiles?.avatar ?? "",
        prices: item.tutors_services.map((service) => service.price),
        metadata: {
          bio: {
            full: metadata?.bio?.full ?? "",
            short: metadata?.bio?.short ?? "",
            session: metadata?.bio?.session ?? "",
          },
          completedLessons: metadata?.completed_lessons ?? 0,
          reviews: metadata?.reviews ?? 0,
          tags: metadata?.tags ?? [],
          trustedBySchools: metadata?.trusted_by_schools ?? false,
          degree: metadata?.degree ?? "",
          grades:
            metadata?.grades?.map((grade) => ({
              grade: grade.grade,
              level: grade.level,
              subject: grade.subject,
            })) ?? [],
          university: metadata?.university ?? "",
        },
      };
    }),
  };
}

export async function getTutorsPaginatedCached(
  pageNumber: number
): Promise<PageResponse<TutorWithPrices>> {
  const supabase = await createClient();

  return unstable_cache(
    () => getTutorsPaginated(supabase, pageNumber),
    [`tutors-paginated-${pageNumber}`],
    {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: [`tutors-page-${pageNumber}`],
    }
  )();
}

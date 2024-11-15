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
    .range(offset, offset + perPage - 1)
    .returns<
      {
        id: string;
        metadata: {
          bio: {
            full: string;
            short: string;
            session: string;
          };
          completed_lessons: number;
          reviews: number;
          tags: string[];
          trusted_by_schools: boolean;
          degree: string;
          grades: {
            grade: string;
            level: string;
            subject: string;
          }[];
          university: string;
        };
        profiles: {
          name: string;
          avatar: string;
        };
        tutors_services: {
          price: number;
        }[];
      }[]
    >();

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
      return {
        id: item.id,
        name: item.profiles?.name ?? "Unknown Tutor",
        avatar: item.profiles?.avatar ?? "",
        prices: item.tutors_services.map((service) => service.price),
        metadata: {
          bio: {
            full: item.metadata?.bio?.full ?? "",
            short: item.metadata?.bio?.short ?? "",
            session: item.metadata?.bio?.session ?? "",
          },
          completedLessons: item.metadata?.completed_lessons ?? 0,
          reviews: item.metadata?.reviews ?? 0,
          tags: item.metadata?.tags ?? [],
          trustedBySchools: item.metadata?.trusted_by_schools ?? false,
          degree: item.metadata?.degree ?? "",
          grades:
            item.metadata?.grades?.map((grade) => ({
              grade: grade.grade,
              level: grade.level,
              subject: grade.subject,
            })) ?? [],
          university: item.metadata?.university ?? "",
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

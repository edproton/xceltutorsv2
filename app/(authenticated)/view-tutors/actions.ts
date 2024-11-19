"use server";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { PageResponse, PriceRange, TutorQueryResult } from "./types";
import { profiles, tutors, tutorsServices } from "@/supabase/migrations/schema";
import { db } from "@/lib/database";

export async function getTutorsPaginated(
  pageNumber: number
): Promise<PageResponse<TutorQueryResult>> {
  const perPage = 5;
  const offset = (pageNumber - 1) * perPage;

  const tutorRecords = await db
    .select({
      id: tutors.id,
      name: sql<string>`${profiles.name}`,
      avatarUrl: sql<string>`${profiles.avatarUrl}`,
      priceRange: sql<PriceRange>`
      CASE 
        WHEN MIN(${tutorsServices.price}) != MAX(${tutorsServices.price}) 
        THEN jsonb_build_object('min', MIN(${tutorsServices.price}), 'max', MAX(${tutorsServices.price}))
        ELSE jsonb_build_object('value', MIN(${tutorsServices.price}))
      END
    `.as("priceRange"),
      bioShort: sql<string>`metadata->'bio'->>'short'`.as("bioShort"),
      tags: sql<string[]>`metadata->'tags'`.as("tags"),
      degree: sql<string>`metadata->>'degree'`.as("degree"),
      university: sql<string>`metadata->>'university'`.as("university"),
      completedLessons: sql<number>`(metadata->>'completed_lessons')::int`.as(
        "completedLessons"
      ),
      reviews: sql<number>`(metadata->>'reviews')::int`.as("reviews"),
    })
    .from(tutors)
    .leftJoin(profiles, eq(tutors.profileId, profiles.id))
    .leftJoin(tutorsServices, eq(tutors.id, tutorsServices.tutorId))
    .limit(perPage)
    .offset(offset)
    .groupBy(tutors.id, profiles.name, profiles.avatarUrl, tutors.metadata);

  const totalItems = await db
    .select({ count: sql`count(${tutors.id})` })
    .from(tutors)
    .then((result) => Number(result[0]?.count) || 0);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    page: pageNumber,
    perPage: perPage,
    totalItems: totalItems,
    totalPages: totalPages,
    items: tutorRecords,
  };
}

export async function getTutorsPaginatedCached(pageNumber: number) {
  return unstable_cache(
    () => getTutorsPaginated(pageNumber),
    [`tutors-paginated-${pageNumber}`],
    {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: [`tutors-page-${pageNumber}`],
    }
  )();
}

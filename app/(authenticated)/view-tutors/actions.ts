"use server";

import { unstable_cache } from "next/cache";
import { PageResponse, TutorWithPrices } from "./types";
import { db } from "@/lib/database";
import { NotNull, sql } from "kysely";

export async function getTutorsPaginated(
  pageNumber: number
): Promise<PageResponse<TutorWithPrices>> {
  const perPage = 5;
  const _pageNumber = Number.isNaN(Number(pageNumber))
    ? 1
    : Math.max(1, Number(pageNumber));
  const offset = (_pageNumber - 1) * perPage;

  const tutors = await db
    .selectFrom("tutors")
    .innerJoin("profiles", "profiles.id", "tutors.profileId")
    .leftJoin("tutorsServices", "tutorsServices.tutorId", "tutors.id")
    .select([
      "tutors.id",
      "tutors.metadata",
      "profiles.name",
      "profiles.avatar",
      sql`ARRAY_AGG(tutors_services.price)`.as("prices"),
    ])
    .groupBy([
      "tutors.id",
      "profiles.name",
      "profiles.avatar",
      "tutors.metadata",
    ])
    .$narrowType<{
      avatar: NotNull;
      prices: number[];
    }>()
    .orderBy("tutors.createdAt", "desc")
    .where("avatar", "is not", null)

    .offset(offset)
    .limit(perPage)
    .execute();

  console.log(tutors);

  const totalItems = await db
    .selectFrom("tutors")
    .select(db.fn.count("tutors.id").as("count"))
    .executeTakeFirstOrThrow();

  const totalItemsCount = parseInt(String(totalItems.count), 10); // Safely parse as an integer

  if (isNaN(totalItemsCount)) {
    throw new Error("Failed to fetch total items count.");
  }

  const totalPages = Math.ceil(totalItemsCount / perPage);

  // Type-safe data mapping
  return {
    page: pageNumber,
    perPage: perPage,
    totalItems: Number(totalItems.count),
    totalPages: totalPages,
    items: tutors,
  };
}

export async function getTutorsPaginatedCached(
  pageNumber: number
): Promise<PageResponse<TutorWithPrices>> {
  return unstable_cache(
    () => getTutorsPaginated(pageNumber),
    [`tutors-paginated-${pageNumber}`],
    {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: [`tutors-page-${pageNumber}`],
    }
  )();
}

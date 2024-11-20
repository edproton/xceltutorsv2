import { db } from "@/lib/database";
import { sql } from "kysely";
import { PageResponse, ResponseWrapper, TutorMetadata } from "@/lib/types";

type TutorDBResult = {
  id: string;
  metadata: TutorMetadata;
  name: string;
  avatar: string;
  prices: number[];
};

export type GetTutorsPaginatedQueryResponseItem = {
  id: string;
  metadata: TutorMetadata;
  name: string;
  avatar: string;
  prices: number[];
};

export type GetTutorsPaginatedQueryResponse =
  PageResponse<GetTutorsPaginatedQueryResponseItem>;

export class GetTutorsPaginatedQuery {
  private static transformTutor(
    tutor: TutorDBResult
  ): GetTutorsPaginatedQueryResponseItem {
    return {
      id: tutor.id,
      metadata: tutor.metadata,
      name: tutor.name,
      avatar: tutor.avatar,
      prices: tutor.prices,
    };
  }

  static async execute(
    pageNumber: number,
    pageSize: number = 5
  ): Promise<ResponseWrapper<GetTutorsPaginatedQueryResponse>> {
    try {
      const offset = (pageNumber - 1) * pageSize;

      // Fetch paginated tutors
      const tutors = await db
        .selectFrom("tutors")
        .innerJoin("profiles", "profiles.id", "tutors.profileId")
        .leftJoin("tutorsServices", "tutorsServices.tutorId", "tutors.id")
        .select([
          "tutors.id",
          "tutors.metadata as metadata",
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
        .$castTo<TutorDBResult>()
        .where("avatar", "is not", null)
        .offset(offset)
        .limit(pageSize)
        .orderBy("tutors.createdAt", "desc")
        .execute();

      if (!tutors.length) {
        return ResponseWrapper.fail("No tutors found.");
      }

      // Fetch total items count
      const totalItemsResult = await db
        .selectFrom("tutors")
        .select(db.fn.count("tutors.id").as("count"))
        .executeTakeFirstOrThrow();

      const totalItems = Number(totalItemsResult.count);
      const totalPages = Math.ceil(totalItems / pageSize);

      return ResponseWrapper.success({
        items: tutors.map((tutor) => this.transformTutor(tutor)),
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to fetch tutors: ${error.message}`);
      }

      return ResponseWrapper.fail("Failed to fetch tutors.");
    }
  }
}

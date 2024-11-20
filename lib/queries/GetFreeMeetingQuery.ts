import { db } from "@/lib/database";
import { ResponseWrapper } from "@/lib/types";

type GetFreeMeetingQueryResponse = {
  id: number;
  tutorId: string;
  createdByProfileId: string;
  type: string;
};

export class GetFreeMeetingQuery {
  static async execute(
    userId: string,
    tutorId: string
  ): Promise<ResponseWrapper<GetFreeMeetingQueryResponse | undefined>> {
    try {
      // Step 1: Validate User Profile
      const userProfile = await db
        .selectFrom("profiles")
        .select(["id"])
        .where("id", "=", userId)
        .executeTakeFirst();

      if (!userProfile) {
        return ResponseWrapper.fail("User profile not found.");
      }

      // Step 2: Fetch Free Meeting
      const freeMeeting = await db
        .selectFrom("bookings")
        .select(["id", "tutorId", "createdByProfileId", "type"])
        .where("tutorId", "=", tutorId)
        .where("createdByProfileId", "=", userProfile.id)
        .where("type", "=", "Free Meeting")
        .executeTakeFirst();

      return ResponseWrapper.success(freeMeeting);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to fetch free meeting: ${error.message}`
        );
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while fetching the free meeting."
      );
    }
  }
}

import { db } from "@/lib/database";
import { Profile, ResponseWrapper, Role } from "@/lib/types";

type UserProfileDBResult = Profile;

export type GetUserProfileQueryResponse = Profile & {
  role: Role;
};

export class GetUserProfileQuery {
  static async execute(
    userId: string
  ): Promise<ResponseWrapper<GetUserProfileQueryResponse>> {
    try {
      const userProfile = await db
        .selectFrom("profiles")
        .select(["id", "name", "avatar"])
        .$narrowType<UserProfileDBResult>()
        .where("id", "=", userId)
        .executeTakeFirst();

      if (!userProfile) {
        return ResponseWrapper.fail("User profile not found.");
      }

      const isTutor = await db
        .selectFrom("tutors")
        .select("profileId")
        .where("profileId", "=", userProfile.id)
        .limit(1)
        .executeTakeFirst()
        .then((result) => !!result);

      const result: GetUserProfileQueryResponse = {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        role: isTutor ? "tutor" : "student",
      };

      return ResponseWrapper.success(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to fetch user profile: ${error.message}`
        );
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while fetching the user profile."
      );
    }
  }
}

import { db } from "@/lib/database";
import { Profile, ResponseWrapper } from "@/lib/types";

type UserProfileDBResult = Profile;

export type GetUserProfileQueryResponse = Profile;

export class GetUserProfileQuery {
  private static transformUserProfile(
    profile: UserProfileDBResult
  ): GetUserProfileQueryResponse {
    return {
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
    };
  }

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

      return ResponseWrapper.success(this.transformUserProfile(userProfile));
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

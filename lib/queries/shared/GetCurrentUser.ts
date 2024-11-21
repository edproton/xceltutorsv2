import { Profile, ResponseWrapper, Role } from "@/lib/types";
import { GetUserFromSupabaseQuery } from "../GetUserFromSupabase";
import { GetUserProfileQuery } from "../GetUserProfileQuery";
import { db } from "@/lib/database";

export type GetCurrentUserQueryResponse = Profile & {
  role: Role;
};

export class GetCurrentUserQuery {
  static async execute(): Promise<
    ResponseWrapper<GetCurrentUserQueryResponse>
  > {
    try {
      const supabaseUser = await GetUserFromSupabaseQuery.execute();
      if (supabaseUser.error) {
        return ResponseWrapper.fail(supabaseUser.error);
      }

      const userProfile = await GetUserProfileQuery.execute(
        supabaseUser.data.user.id
      );

      if (userProfile.error) {
        return ResponseWrapper.fail(userProfile.error);
      }

      const isTutor = await db
        .selectFrom("tutors")
        .select("profileId")
        .where("profileId", "=", userProfile.data.id)
        .limit(1)
        .executeTakeFirst()
        .then((result) => !!result);

      return ResponseWrapper.success({
        id: supabaseUser.data.user.id,
        name: userProfile.data.name,
        email: supabaseUser.data.user.id,
        avatar: userProfile.data.avatar,
        role: isTutor ? "tutor" : "student",
      });
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

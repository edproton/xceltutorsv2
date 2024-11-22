import { ResponseWrapper, User } from "@/lib/types";
import { GetUserFromSupabaseQuery } from "../GetUserFromSupabase";
import { GetUserProfileQuery } from "../GetUserProfileQuery";

export type GetCurrentUserQueryResponse = User & {
  email: string;
};

export class GetCurrentUserQuery {
  static async execute(): Promise<
    ResponseWrapper<GetCurrentUserQueryResponse>
  > {
    const currentUserQuery = await GetUserFromSupabaseQuery.execute();
    const { user } = currentUserQuery.data;
    if (currentUserQuery.error) {
      return ResponseWrapper.fail(currentUserQuery.error);
    }

    if (!currentUserQuery.data) {
      return ResponseWrapper.fail("User not found.");
    }

    const profileQuery = await GetUserProfileQuery.execute(user.id);
    if (profileQuery.error) {
      return ResponseWrapper.fail(profileQuery.error);
    }

    if (!profileQuery.data) {
      return ResponseWrapper.fail("User profile not found.");
    }

    const currentUser = {
      ...profileQuery.data,
      ...user,
    };

    return ResponseWrapper.success(currentUser);
  }
}

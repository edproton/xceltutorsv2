import { createClient } from "../supabase/server";
import { ResponseWrapper } from "../types";

type GetUserFromSupabaseQueryResponse = {
  user: {
    id: string;
    email: string;
  };
};

export class GetUserFromSupabaseQuery {
  static async execute(): Promise<
    ResponseWrapper<GetUserFromSupabaseQueryResponse>
  > {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return ResponseWrapper.fail(error.message);
      }

      if (!user || !user?.email || !user?.id) {
        return ResponseWrapper.fail("User not found");
      }

      return ResponseWrapper.success({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("GetAuthenticatedUserQuery error:", e.message);

        return ResponseWrapper.fail(e.message);
      }

      return ResponseWrapper.fail("An error occurred while fetching the user");
    }
  }
}

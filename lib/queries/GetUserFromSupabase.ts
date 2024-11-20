import { createClient } from "../supabase/server";
import { ResponseWrapper } from "../types";
type AuthenticatedResponse = {
  user: {
    id: string;
  };
};

export class GetAuthenticatedUserQuery {
  static async execute(): Promise<ResponseWrapper<AuthenticatedResponse>> {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return ResponseWrapper.fail(error.message);
      }

      return ResponseWrapper.success({
        user: {
          id: user!.id,
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

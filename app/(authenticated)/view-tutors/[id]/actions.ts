"use server";

import { GetTutorByIdQuery } from "@/lib/queries/GetTutorByIdQuery";
import { GetAuthenticatedUserQuery } from "@/lib/queries/GetUserFromSupabase";
import { ResponseWrapper } from "@/lib/types";

export async function getTutorById(id: string) {
  const { error, data } = await GetAuthenticatedUserQuery.execute();
  if (error) {
    return ResponseWrapper.fail(error);
  }

  const tutorQuery = await GetTutorByIdQuery.execute(data.user.id, id);

  if (tutorQuery.error) {
    return ResponseWrapper.fail(tutorQuery.error);
  }

  return ResponseWrapper.success(tutorQuery.data);
}

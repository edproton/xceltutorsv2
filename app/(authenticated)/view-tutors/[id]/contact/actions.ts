"use server";

import { GetFreeMeetingQuery } from "@/lib/queries/GetFreeMeetingQuery";
import { GetTutorWithGroupedServicesQuery } from "@/lib/queries/GetTutorWithGroupedServicesQuery";
import { GetAuthenticatedUserQuery } from "@/lib/queries/GetUserFromSupabase";
import { ResultError } from "@/lib/safe-action";
import { redirect } from "next/navigation";

export async function getTutorWithGroupedServices(tutorId: string) {
  const {
    error: userError,
    data: { user },
  } = await GetAuthenticatedUserQuery.execute();
  if (userError) {
    throw new ResultError(userError);
  }

  const getFreeMeetingQuery = await GetFreeMeetingQuery.execute(
    user.id,
    tutorId
  );

  if (!getFreeMeetingQuery.error && getFreeMeetingQuery.data) {
    redirect(`/view-tutors/${tutorId}?freeMeeting=true`);
  }

  const getTutorWithGroupedServicesQuery =
    await GetTutorWithGroupedServicesQuery.execute(user.id, tutorId);

  if (getTutorWithGroupedServicesQuery.error) {
    throw new ResultError(getTutorWithGroupedServicesQuery.error);
  }

  return getTutorWithGroupedServicesQuery.data;
}

"use server";

import { GetTutorsPaginatedQuery } from "@/lib/queries/GetTutorsPaginatedQuery";
import { GetCurrentUserQuery } from "@/lib/queries/shared/GetCurrentUserQuery";
import { ResponseWrapper } from "@/lib/types";
import { notFound } from "next/navigation";

export async function getTutorsPaginated(pageNumber: number) {
  const currentUser = await GetCurrentUserQuery.execute();
  if (currentUser.data.role === "tutor") {
    return notFound();
  }

  const _pageNumber = Number.isNaN(Number(pageNumber))
    ? 1
    : Math.max(1, Number(pageNumber));

  const { error, data } = await GetTutorsPaginatedQuery.execute(_pageNumber);
  if (error) {
    return ResponseWrapper.fail(error);
  }

  return ResponseWrapper.success(data);
}

"use server";

import { GetTutorsPaginatedQuery } from "@/lib/queries/GetTutorsPaginatedQuery";
import { ResponseWrapper } from "@/lib/types";

export async function getTutorsPaginated(pageNumber: number) {
  const _pageNumber = Number.isNaN(Number(pageNumber))
    ? 1
    : Math.max(1, Number(pageNumber));

  const { error, data } = await GetTutorsPaginatedQuery.execute(_pageNumber);
  if (error) {
    return ResponseWrapper.fail(error);
  }

  return ResponseWrapper.success(data);
}

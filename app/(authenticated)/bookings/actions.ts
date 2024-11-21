"use server";

import { GetBookingsWithPaginationQuery } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { GetAuthenticatedUserQuery } from "@/lib/queries/GetUserFromSupabase";

export const getBookingsWithPaginationQuery = async () => {
  const getAuthenticatedUserQuery = await GetAuthenticatedUserQuery.execute();
  const getBookingsWithPaginationQuery =
    await GetBookingsWithPaginationQuery.execute(
      getAuthenticatedUserQuery.data.user.id,
      1
    );

  return getBookingsWithPaginationQuery;
};

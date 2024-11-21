"use server";

import { SetBookingStatusCommand } from "@/lib/commands/SetBookingStatusCommand ";
import { GetBookingsWithPaginationQuery } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { GetUserFromSupabaseQuery } from "@/lib/queries/GetUserFromSupabase";
import { actionClient, ResultError } from "@/lib/safe-action";
import { z } from "zod";

export const getBookingsWithPaginationQuery = async () => {
  const getAuthenticatedUserQuery = await GetUserFromSupabaseQuery.execute();
  const getBookingsWithPaginationQuery =
    await GetBookingsWithPaginationQuery.execute(
      getAuthenticatedUserQuery.data.user.id,
      1
    );

  return {
    bookings: getBookingsWithPaginationQuery.data,
    userId: getAuthenticatedUserQuery.data.user.id,
  };
};

const confirmBookingQuerySchema = z.object({
  bookingId: z.number().min(1),
});

export const confirmAwaitingPaymentBookingQuery = actionClient
  .schema(confirmBookingQuerySchema)
  .action(async ({ parsedInput }) => {
    // TODO: Add a check to see if the booking belongs to the tutor and the student.
    // The tutor is the one that is available to confirm the booking.
    const setBookingStatusCommand = await SetBookingStatusCommand.execute(
      parsedInput.bookingId,
      "AwaitingPayment"
    );

    if (setBookingStatusCommand.error) {
      throw new ResultError(setBookingStatusCommand.error);
    }
  });

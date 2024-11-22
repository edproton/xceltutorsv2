"use server";

import { SetBookingStatusCommand } from "@/lib/commands/SetBookingStatusCommand ";
import { GetBookingsWithPaginationQuery } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { GetUserFromSupabaseQuery } from "@/lib/queries/GetUserFromSupabase";
import { GetUserProfileQuery } from "@/lib/queries/GetUserProfileQuery";
import { actionClient, ResultError } from "@/lib/safe-action";
import { z } from "zod";

export const getBookingsWithPaginationQuery = async () => {
  const getAuthenticatedUserQuery = await GetUserFromSupabaseQuery.execute();

  if (getAuthenticatedUserQuery.error) {
    throw new ResultError(getAuthenticatedUserQuery.error);
  }

  const getUserProfileQuery = await GetUserProfileQuery.execute(
    getAuthenticatedUserQuery.data.user.id
  );

  if (getUserProfileQuery.error) {
    throw new ResultError(getUserProfileQuery.error);
  }

  const getBookingsWithPaginationQuery =
    await GetBookingsWithPaginationQuery.execute(getUserProfileQuery.data, 1);

  return {
    bookings: getBookingsWithPaginationQuery.data,
    userId: getAuthenticatedUserQuery.data.user.id,
  };
};

const confirmBookingQuerySchema = z.object({
  bookingId: z.number().min(1),
});

export const studentConfirmationBookingQuery = actionClient
  .schema(confirmBookingQuerySchema)
  .action(async ({ parsedInput }) => {
    // TODO: Add a check to see if the booking belongs to the tutor and the student.
    // The tutor is the one that is available to confirm the booking.
    const setBookingStatusCommand = await SetBookingStatusCommand.execute(
      parsedInput.bookingId,
      "AwaitingStudentConfirmation"
    );

    if (setBookingStatusCommand.error) {
      throw new ResultError(setBookingStatusCommand.error);
    }
  });

export const tutorConfirmationBookingQuery = actionClient
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

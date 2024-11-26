"use server";

import { SetBookingStatusCommand } from "@/lib/commands/SetBookingStatusCommand ";
import { GetBookingsWithPaginationQuery } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { GetUserProfileQuery } from "@/lib/queries/GetUserProfileQuery";
import { GetCurrentUserQuery } from "@/lib/queries/shared/GetCurrentUserQuery";
import { actionClient, ResultError } from "@/lib/safe-action";
import { BookingStatus } from "@/lib/types";
import { z } from "zod";

export const getBookingsWithPaginationQuery = async () => {
  const getAuthenticatedUserQuery = await GetCurrentUserQuery.execute();

  if (getAuthenticatedUserQuery.error) {
    throw new ResultError(getAuthenticatedUserQuery.error);
  }

  const getUserProfileQuery = await GetUserProfileQuery.execute(
    getAuthenticatedUserQuery.data.id
  );

  if (getUserProfileQuery.error) {
    throw new ResultError(getUserProfileQuery.error);
  }

  const getBookingsWithPaginationQuery =
    await GetBookingsWithPaginationQuery.execute(getUserProfileQuery.data, 1);

  return {
    bookings: getBookingsWithPaginationQuery.data,
    currentUser: getAuthenticatedUserQuery.data,
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
      "AwaitingTutorConfirmation"
    );

    if (setBookingStatusCommand.error) {
      throw new ResultError(setBookingStatusCommand.error);
    }
  });

export const rescheduleBookingQuery = actionClient
  .schema(confirmBookingQuerySchema)
  .action(async ({ parsedInput }) => {
    const currentUser = await GetCurrentUserQuery.execute();
    const status: BookingStatus =
      currentUser.data.role === "tutor"
        ? "TutorRequestedReschedule"
        : "StudentRequestedReschedule";

    const setBookingStatusCommand = await SetBookingStatusCommand.execute(
      parsedInput.bookingId,
      status
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

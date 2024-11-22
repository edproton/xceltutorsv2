import { db } from "@/lib/database";
import { BookingStatus, ResponseWrapper } from "@/lib/types";

export const validTransitions: Record<BookingStatus, BookingStatus[]> = {
  AwaitingTutorConfirmation: ["AwaitingPayment", "Canceled"],
  AwaitingStudentConfirmation: [
    "AwaitingTutorConfirmation",
    "AwaitingPayment",
    "Canceled",
  ],
  AwaitingPayment: ["PaymentFailed", "Scheduled", "Canceled"],
  PaymentFailed: ["AwaitingPayment", "Canceled"],
  Scheduled: ["Completed", "Canceled"],
  Canceled: [],
  Completed: [],
};

export class SetBookingStatusCommand {
  static async execute(
    bookingId: number,
    status: BookingStatus
  ): Promise<ResponseWrapper<void>> {
    try {
      // Step 1: Validate Booking Exists
      const booking = await db
        .selectFrom("bookings")
        .select(["id", "status"])
        .where("id", "=", bookingId)
        .executeTakeFirst();

      if (!booking) {
        return ResponseWrapper.fail("Booking not found.");
      }

      // Step 2: Validate Status Transition
      const allowedStatuses = validTransitions[booking.status];
      if (!allowedStatuses?.includes(status)) {
        return ResponseWrapper.fail(
          `Cannot transition from ${booking.status} to ${status}.`
        );
      }

      // Step 3: Update Booking Status
      await db
        .updateTable("bookings")
        .set({
          status: status,
          updatedAt: new Date(),
        })
        .where("id", "=", bookingId)
        .execute();

      return ResponseWrapper.empty();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to update booking status: ${error.message}`
        );
      }
      return ResponseWrapper.fail(
        "An unknown error occurred while updating booking status."
      );
    }
  }
}

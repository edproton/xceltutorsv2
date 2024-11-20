"use server";

import { db } from "@/lib/database";
import { actionClient } from "@/lib/safe-action";
import { getBookingByIdSchema } from "./schemas";

export const getBookingById = actionClient
  .schema(getBookingByIdSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const existingBooking = await db
      .selectFrom("bookings")
      .select([
        "id",
        "startTime",
        "endTime",
        "status",
        "metadata",
        "createdByProfileId",
      ])
      .where("id", "=", Number(bookingId))
      .executeTakeFirst();

    if (!existingBooking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    const bookingLevel = await db
      .selectFrom("levels")
      .leftJoin("subjects", "subjects.id", "levels.subjectId")
      .select(["levels.id", "levels.name", "subjects.name as subjectName"])
      .where("levels.id", "=", existingBooking.metadata.levelId)
      .executeTakeFirst();

    return {
      success: true,
      booking: existingBooking,
      bookingLevel,
    };
  });

import { db } from "@/lib/database";
import { sql } from "kysely";
import {
  Booking,
  BookingStatus,
  BookingType,
  ResponseWrapper,
} from "@/lib/types";
import { DateTime } from "luxon";

type BookingDBResult = {
  id: number;
  startTime: Date; // UTC ISO string
  endTime: Date; // UTC ISO string
  status: BookingStatus;
  type: BookingType;
  createdByProfileId: string;
  createdByProfileName: string;
  createdByProfileAvatar: string;
  forTutorId: string;
  forTutorName: string;
  forTutorAvatar: string;
  levelName: string;
  subjectName: string;
};

export class GetBookingByIdQuery {
  private static convertToLondonTime(utcTime: string): string {
    return DateTime.fromISO(utcTime, { zone: "utc" })
      .setZone("Europe/London")
      .toISO()!;
  }

  private static transformBooking(booking: BookingDBResult): Booking {
    return {
      id: booking.id,
      startTime: this.convertToLondonTime(booking.startTime.toISOString()),
      endTime: this.convertToLondonTime(booking.endTime.toISOString()),
      status: booking.status,
      type: booking.type,
      createdBy: {
        id: booking.createdByProfileId,
        name: booking.createdByProfileName,
        avatar: booking.createdByProfileAvatar,
      },
      forTutor: {
        id: booking.forTutorId,
        name: booking.forTutorName,
        avatar: booking.forTutorAvatar,
      },
      level: {
        name: booking.levelName,
        subject: {
          name: booking.subjectName,
        },
      },
    };
  }

  static async execute(bookingId: number): Promise<ResponseWrapper<Booking>> {
    try {
      const booking = await db
        .selectFrom("bookings")
        .innerJoin("levels", (join) =>
          join.on((eb) =>
            eb(
              "levels.id",
              "=",
              sql<number>`(${eb.ref("bookings.metadata")}->>'levelId')::integer`
            )
          )
        )
        .innerJoin("subjects", "levels.subjectId", "subjects.id")
        .innerJoin(
          "profiles as createdBy",
          "bookings.createdByProfileId",
          "createdBy.id"
        )
        .innerJoin("tutors", "bookings.tutorId", "tutors.id")
        .innerJoin("profiles as forTutor", "tutors.profileId", "forTutor.id")
        .select([
          "bookings.id",
          "bookings.startTime",
          "bookings.endTime",
          "bookings.status",
          "bookings.type",
          "createdBy.name as createdByProfileName",
          "createdBy.id as createdByProfileId",
          "createdBy.avatar as createdByProfileAvatar",
          "forTutor.name as forTutorName",
          "forTutor.id as forTutorId",
          "forTutor.avatar as forTutorAvatar",
          "levels.name as levelName",
          "subjects.name as subjectName",
        ])
        .$narrowType<BookingDBResult>()
        .where("bookings.id", "=", bookingId)
        .executeTakeFirst();

      if (!booking) {
        return ResponseWrapper.fail("Booking not found.");
      }

      return ResponseWrapper.success(this.transformBooking(booking));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to fetch booking: ${error.message}`
        );
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while fetching the booking."
      );
    }
  }
}

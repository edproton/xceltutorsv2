import { db } from "@/lib/database";
import { sql } from "kysely";
import type {
  PageResponse,
  Booking,
  BookingType,
  BookingStatus,
  Response,
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

export class GetBookingsWithPaginationQuery {
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

  static async execute(
    pageNumber: number,
    pageSize: number = 5
  ): Promise<Response<PageResponse<Booking>>> {
    try {
      const offset = (pageNumber - 1) * pageSize;

      // Fetch paginated bookings
      const bookings = await db
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
        .offset(offset)
        .limit(pageSize)
        .$narrowType<BookingDBResult>()
        .execute();

      if (!bookings.length) {
        return { error: "No bookings found for the given page", data: null };
      }

      const totalItemsResult = await db
        .selectFrom("bookings")
        .select(db.fn.count("id").as("count"))
        .executeTakeFirstOrThrow();

      const totalItems = Number(totalItemsResult.count);
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        error: null,
        data: {
          items: bookings.map((booking) => this.transformBooking(booking)),
          totalItems,
          totalPages,
          pageNumber,
          pageSize,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          error: `Failed to fetch bookings: ${error.message}`,
          data: null,
        };
      }

      return {
        error: "An unknown error occurred while fetching bookings.",
        data: null,
      };
    }
  }
}

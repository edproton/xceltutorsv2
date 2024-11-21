import { db } from "@/lib/database";
import { sql } from "kysely";
import {
  PageResponse,
  Booking,
  BookingType,
  BookingStatus,
  ResponseWrapper,
} from "@/lib/types";
import { DateTime } from "luxon";
import { convertToLondonTime } from "../utils";

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

export type GetBookingsWithPaginationQueryResponseItem = Booking;
export type GetBookingsWithPaginationQueryResponse = PageResponse<Booking>;

export class GetBookingsWithPaginationQuery {
  private static transformBooking(booking: BookingDBResult): Booking {
    return {
      id: booking.id,
      startTime: convertToLondonTime(booking.startTime.toISOString()),
      endTime: convertToLondonTime(booking.endTime.toISOString()),
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
      subject: {
        name: booking.subjectName,
        level: {
          name: booking.levelName,
        },
      },
    };
  }

  static async execute(
    userId: string,
    pageNumber: number,
    pageSize: number = 5
  ): Promise<ResponseWrapper<GetBookingsWithPaginationQueryResponse>> {
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
        .where((eb) =>
          eb.or([
            eb("createdBy.id", "=", userId),
            eb("forTutor.id", "=", userId),
          ])
        )
        .offset(offset)
        .limit(pageSize)
        .$narrowType<BookingDBResult>()
        .execute();

      if (!bookings) {
        return ResponseWrapper.fail("No bookings found for the given page");
      }

      const totalItemsResult = await db
        .selectFrom("bookings")
        .select(db.fn.count("id").as("count"))
        .executeTakeFirstOrThrow();

      const totalItems = Number(totalItemsResult.count);
      const totalPages = Math.ceil(totalItems / pageSize);

      const result = {
        items: bookings.map((booking) => this.transformBooking(booking)),
        totalItems,
        totalPages,
        pageNumber,
        pageSize,
      };

      return ResponseWrapper.success(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to fetch bookings: ${error.message}`
        );
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while fetching bookings."
      );
    }
  }
}

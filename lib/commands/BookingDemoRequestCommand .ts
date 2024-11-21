import { db } from "@/lib/database";
import { CardMessage, ResponseWrapper, TextMessage } from "@/lib/types";
import { DateTime } from "luxon";
import { SendMessageCommand } from "./SendMessageCommand ";

interface BookingDemoRequestInput {
  tutorId: string;
  meetingDate: Date;
  meetingTime: string;
  levelId: number;
  message: string;
}

export class BookingDemoRequestCommand {
  static async execute(
    booking: BookingDemoRequestInput,
    userId: string
  ): Promise<ResponseWrapper<void>> {
    try {
      // Step 1: Validate User Profile
      const userProfile = await db
        .selectFrom("profiles")
        .select(["id", "name"])
        .where("id", "=", userId)
        .executeTakeFirst();

      if (!userProfile) {
        return ResponseWrapper.fail("User not found.");
      }

      // Step 2: Validate Tutor Profile
      const tutorProfile = await db
        .selectFrom("tutors")
        .select(["profileId"])
        .where("id", "=", booking.tutorId)
        .executeTakeFirst();

      if (!tutorProfile) {
        return ResponseWrapper.fail("Tutor not found.");
      }

      // Step 3: Parse Meeting Date and Time
      const meetingDate = DateTime.fromJSDate(booking.meetingDate, {
        zone: "Europe/London",
      });
      const [hours, minutes] = booking.meetingTime.split(":").map(Number);
      const meetingStartTime = meetingDate.set({
        hour: hours,
        minute: minutes,
      });
      const meetingEndTime = meetingStartTime.plus({ minutes: 15 });
      const startTimeUTC = meetingStartTime.toUTC();
      const endTimeUTC = meetingEndTime.toUTC();

      // Step 4: Check for Existing Booking
      const existingBooking = await db
        .selectFrom("bookings")
        .select(["id"])
        .where("tutorId", "=", booking.tutorId)
        .where((eb) =>
          eb.and([
            eb("startTime", "<", endTimeUTC.toJSDate()),
            eb("endTime", ">", startTimeUTC.toJSDate()),
          ])
        )
        .executeTakeFirst();

      if (existingBooking) {
        return ResponseWrapper.fail(
          "This time slot is already booked. Please select another time."
        );
      }

      // Step 5: Create New Booking
      const [bookingData] = await db
        .insertInto("bookings")
        .values({
          tutorId: booking.tutorId,
          createdByProfileId: userProfile.id,
          type: "Free Meeting",
          startTime: startTimeUTC.toJSDate(),
          endTime: endTimeUTC.toJSDate(),
          status: "AwaitingTutorConfirmation",
          metadata: {
            levelId: booking.levelId,
          },
        })
        .returning("id")
        .execute();

      if (!bookingData) {
        return ResponseWrapper.fail("Failed to create booking.");
      }

      // Step 6: Check for Existing Conversation
      const existingConversation = await db
        .selectFrom("conversations")
        .where("fromProfileId", "=", userProfile.id)
        .where("toProfileId", "=", tutorProfile.profileId)
        .executeTakeFirst();

      if (existingConversation) {
        return ResponseWrapper.fail(
          "You already have an established conversation with this user."
        );
      }

      // Step 7: Create New Conversation
      const [newConversation] = await db
        .insertInto("conversations")
        .values({
          fromProfileId: userProfile.id,
          toProfileId: tutorProfile.profileId,
        })
        .returning("id")
        .execute();

      // Step 8: Send Messages
      const messageBase = {
        conversationId: newConversation.id,
        senderProfileId: userId,
      };

      const cardMessageContent: CardMessage = {
        title: `📅 Free Tutoring Request from ${userProfile.name}`,
        description: `<b>Date:</b> ${meetingStartTime.toLocaleString(
          DateTime.DATE_MED
        )}\n<b>Time:</b> ${meetingStartTime.toFormat(
          "h:mm a"
        )} - ${meetingEndTime.toFormat("h:mm a")}`,
        type: "card",
        actions: [
          {
            label: "View Booking Details",
            callback: {
              name: "view-booking-details-dialog",
              params: { bookingId: bookingData.id.toString() },
            },
          },
        ],
      };

      const cardMessageResponse = await SendMessageCommand.execute({
        ...messageBase,
        content: cardMessageContent,
        visibleTo: "to",
      });

      if (cardMessageResponse.error) {
        return ResponseWrapper.fail("Failed to send card message.");
      }

      const textMessageContent: TextMessage = {
        text: booking.message,
        type: "text",
      };

      const textMessageResponse = await SendMessageCommand.execute({
        ...messageBase,
        content: textMessageContent,
        visibleTo: "both",
      });

      if (textMessageResponse.error) {
        return ResponseWrapper.fail("Failed to send text message.");
      }

      return ResponseWrapper.empty();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(`Booking request failed: ${error.message}`);
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while processing the booking request."
      );
    }
  }
}

"use server";

import { actionClient } from "@/lib/safe-action";
import { tutoringFormSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { db } from "@/lib/database";
import {
  CardMessage,
  MessageContent,
  TextMessage,
  VisibleTo,
} from "@/lib/database/types";

export const submitTutoringRequest = actionClient
  .schema(tutoringFormSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Failed to get user data");

    // Get the user's profile
    const userProfile = await db
      .selectFrom("profiles")
      .select(["id", "name"])
      .where("id", "=", user.id)
      .executeTakeFirst();

    if (!userProfile) {
      throw new Error("User not found");
    }

    // Get the tutor's profile
    const tutorProfile = await db
      .selectFrom("tutors")
      .select(["profileId"])
      .where("id", "=", parsedInput.tutorId)
      .executeTakeFirst();

    if (!tutorProfile) {
      throw new Error("Tutor not found");
    }

    const meetingDate = DateTime.fromJSDate(parsedInput.meetingDate, {
      zone: "Europe/London",
    });
    const [hours, minutes] = parsedInput.meetingTime.split(":").map(Number);

    const meetingStartTime = meetingDate.set({ hour: hours, minute: minutes });
    const meetingEndTime = meetingStartTime.plus({ minutes: 15 });

    const startTimeUTC = meetingStartTime.toUTC();
    const endTimeUTC = meetingEndTime.toUTC();

    const existingBooking = await db
      .selectFrom("bookings")
      .select(["id"])
      .where("tutorId", "=", parsedInput.tutorId)
      .where((eb) =>
        eb.and([
          eb("startTime", "<", endTimeUTC.toJSDate()),
          eb("endTime", ">", startTimeUTC.toJSDate()),
        ])
      )
      .executeTakeFirst();

    if (existingBooking) {
      throw new Error(
        "This time slot is already booked. Please select another time."
      );
    }

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        tutor_id: parsedInput.tutorId,
        created_by_profile_id: userProfile.id,
        type: "Free Meeting",
        start_time: startTimeUTC.toISO()!,
        end_time: endTimeUTC.toISO()!,
        status: "PendingDate",
        metadata: {
          levelId: parsedInput.levelId,
        },
      })
      .select("id")
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      throw new Error("Failed to create booking");
    }

    const existingConversation = await db
      .selectFrom("conversations")
      .where("fromProfileId", "=", userProfile.id)
      .where("toProfileId", "=", tutorProfile.profileId)
      .executeTakeFirst();

    if (existingConversation) {
      throw new Error(
        "You already have a estabalished conversation with this user"
      );
    }

    const newConversation = await db
      .insertInto("conversations")
      .values({
        fromProfileId: userProfile.id,
        toProfileId: tutorProfile.profileId,
      })
      .execute();

    const meetingStartDateFormatted = meetingStartTime.toLocaleString(
      DateTime.DATE_MED
    );
    const meetingStartTimeFormatted = meetingStartTime.toFormat("h:mm a");
    const meetingEndTimeFormatted = meetingEndTime.toFormat("h:mm a");

    const cardMessageContent: CardMessage = {
      title: `📅 Free Tutoring Request from ${userProfile.name}`,
      description: `<b>Date:</b> ${meetingStartDateFormatted}\n<b>Time:</b> ${meetingStartTimeFormatted} - ${meetingEndTimeFormatted}`,
      type: "card",
      actions: [
        {
          label: "View Booking Details",
          color: "green",
          callback: {
            name: "view-booking-details-dialog",
            params: {
              bookingId: bookingData!.id.toString(),
            },
          },
        },
      ],
    };

    const message = {
      conversationId: Number(newConversation[0].insertId),
      senderProfileId: user.id,
    };

    const { error: cardMessageError } = await sendMessage({
      ...message,
      content: cardMessageContent,
      visibleTo: "to",
    });

    if (cardMessageError) {
      console.error("Card message insert error:", cardMessageError);
      throw new Error("Failed to send card message");
    }

    const textMessageContent: TextMessage = {
      text: parsedInput.message,
      type: "text",
    };

    const { error: textMessageError } = await sendMessage({
      ...message,
      content: textMessageContent,
      visibleTo: "both",
    });

    if (textMessageError) {
      console.error("Text message insert error:", textMessageError);
      throw new Error("Failed to send text message");
    }

    redirect(`/view-tutors/${parsedInput.tutorId}/contact/confirmation`);
  });

async function sendMessage({
  conversationId,
  senderProfileId,
  content,
  visibleTo,
}: {
  conversationId: number;
  senderProfileId: string;
  content: MessageContent;
  visibleTo: VisibleTo;
}) {
  const [result] = await db
    .insertInto("messages")
    .values({
      conversationId,
      senderProfileId,
      content: [content],
      visibleTo,
      isRead: false,
    })
    .execute();

  const error = !result ? new Error("Failed to insert message") : null;

  if (error) {
    console.error("Message insert error:", error.message);
    throw new Error("Failed to send message");
  }

  return { error };
}

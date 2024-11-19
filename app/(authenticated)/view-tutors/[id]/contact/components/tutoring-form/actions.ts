"use server";

import { actionClient } from "@/lib/safe-action";
import { tutoringFormSchema } from "./schema";
import { createClient, DbSupabaseClient } from "@/lib/supabase/server";
import {
  CardMessage,
  MessageContent,
  TextMessage,
  VisibleTo,
} from "@/app/(authenticated)/messages/types";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";

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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", user.id)
      .single();

    if (profileError) throw new Error("Failed to get profile data");

    // Get the tutor's profile
    const { data: tutorData, error: tutorError } = await supabase
      .from("tutors")
      .select("profile_id")
      .eq("id", parsedInput.tutorId)
      .single();

    if (tutorError)
      throw new Error(`Tutor with id ${parsedInput.tutorId} does not exist`);

    const meetingDate = DateTime.fromJSDate(parsedInput.meetingDate, {
      zone: "Europe/London",
    });
    const [hours, minutes] = parsedInput.meetingTime.split(":").map(Number);

    const meetingStartTime = meetingDate.set({ hour: hours, minute: minutes });
    const meetingEndTime = meetingStartTime.plus({ minutes: 15 });

    const startTimeUTC = meetingStartTime.toUTC();
    const endTimeUTC = meetingEndTime.toUTC();

    const { data: existingBooking, error: existingBookingError } =
      await supabase
        .from("bookings")
        .select("id")
        .or(
          `and(start_time.lte.${endTimeUTC.toISO()},end_time.gte.${startTimeUTC.toISO()})`
        )
        .eq("tutor_id", parsedInput.tutorId)
        .maybeSingle();

    if (existingBookingError) {
      console.error("Error checking existing bookings:", existingBookingError);
      throw new Error("Could not check for existing bookings.");
    }

    if (existingBooking) {
      console.log("Time slot is already booked:", existingBooking.id);
      throw new Error(
        "This time slot is already booked. Please select another time."
      );
    }

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        tutor_id: parsedInput.tutorId,
        created_by_profile_id: profile.id,
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

    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        from_profile_id: profile.id,
        to_profile_id: tutorData.profile_id,
      })
      .select("id")
      .single();

    if (conversationError) {
      if (conversationError.code === "23505") {
        throw new Error("A conversation with this tutor already exists");
      } else {
        console.error("Conversation insert error:", conversationError);
        throw new Error("Failed to create conversation");
      }
    }

    if (!conversationData) {
      console.error("Conversation data is null");
      throw new Error("Failed to retrieve inserted conversation data");
    }

    const meetingStartDateFormatted = meetingStartTime.toLocaleString(
      DateTime.DATE_MED
    );
    const meetingStartTimeFormatted = meetingStartTime.toFormat("h:mm a");
    const meetingEndTimeFormatted = meetingEndTime.toFormat("h:mm a");

    const cardMessageContent: CardMessage = {
      title: `📅 Free Tutoring Request from ${profile.name}`,
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
      conversationId: conversationData.id,
      senderProfileId: user.id,
    };

    const { error: cardMessageError } = await sendMessage(supabase, {
      ...message,
      content: [cardMessageContent],
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

    const { error: textMessageError } = await sendMessage(supabase, {
      ...message,
      content: [textMessageContent],
      visibleTo: "both",
    });

    if (textMessageError) {
      console.error("Text message insert error:", textMessageError);
      throw new Error("Failed to send text message");
    }

    revalidatePath(`tutor-${parsedInput.tutorId}`);
    redirect(`/view-tutors/${parsedInput.tutorId}/contact/confirmation`);
  });

async function sendMessage(
  supabase: DbSupabaseClient,
  {
    conversationId,
    senderProfileId,
    content,
    visibleTo,
  }: {
    conversationId: number;
    senderProfileId: string;
    content: MessageContent[];
    visibleTo: VisibleTo;
  }
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_profile_id: senderProfileId,
    content: [...content],
    visible_to: visibleTo,
    is_read: false,
  });

  if (error) {
    console.error("Message insert error:", error.message);
    throw new Error("Failed to send message");
  }

  return { error };
}

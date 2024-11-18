"use server";

import { actionClient } from "@/lib/safe-action";
import { tutoringFormSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { CardMessage } from "@/app/(authenticated)/messages/types";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";

export const submitTutoringRequest = actionClient
  .schema(tutoringFormSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Failed to get user data");
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile select error:", profileError);
      throw new Error("Failed to get profile data");
    }

    const profileId = profileData.id;

    const { data: tutorData, error: tutorError } = await supabase
      .from("tutors")
      .select("profile_id, id")
      .eq("id", parsedInput.tutorId)
      .single();

    if (tutorError) {
      throw new Error(`Tutor with id ${parsedInput.tutorId} does not exist`);
    }

    const tutorProfileId = tutorData.profile_id;

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
        .eq("tutor_id", tutorData.id)
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
        tutor_id: tutorData.id,
        created_by_profile_id: profileId,
        type: "Free Meeting",
        start_time: startTimeUTC.toISO()!,
        end_time: endTimeUTC.toISO()!,
        status: "Pending",
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
        from_profile_id: profileId,
        to_profile_id: tutorProfileId,
      })
      .select()
      .single();

    if (conversationError) {
      console.error("Conversation insert error:", conversationError);
      throw new Error("Failed to create conversation");
    }

    if (!conversationData) {
      console.error("Conversation data is null");
      throw new Error("Failed to retrieve inserted conversation data");
    }

    const meetingStartDateFormatted = meetingStartTime.toLocaleString(
      DateTime.DATE_MED
    ); // e.g., "Nov 18, 2024"
    const meetingStartTimeFormatted = meetingStartTime.toFormat("h:mm a");
    const meetingEndTimeFormatted = meetingEndTime.toFormat("h:mm a");

    // Create the CardMessage content
    const messageContent: CardMessage = {
      title: `📅 Free Tutoring Request from ${profileData.name}`,
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

    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationData.id,
        from_profile_id: user.id,
        content: [messageContent],
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error("Message insert error:", messageError);
      throw new Error("Failed to send message");
    }

    redirect(`/view-tutors/${parsedInput.tutorId}/contact/confirmation`);
  });

"use server";

import { actionClient } from "@/lib/safe-action";
import { tutoringFormSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { CardMessage } from "@/app/(authenticated)/messages/types";
import { redirect } from "next/navigation";

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
      .select("profile_id")
      .eq("id", parsedInput.tutorId)
      .single();

    if (tutorError) {
      throw new Error(`Tutor with id ${parsedInput.tutorId} does not exist`);
    }

    const tutorProfileId = tutorData.profile_id;

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

    const messageContent: CardMessage = {
      title: `Free tutoring request from ${profileData.name}`,
      description: `Date: ${parsedInput.meetingDate}, \nTime: ${parsedInput.meetingTime}`,
      type: "card",
      actions: [
        {
          label: "Free booking details",
          classes: "bg-green-500 hover:bg-green:400 text-white",
          callback: {
            name: "view-booking-details-dialog",
            params: {
              bookingId: "173ab3e8-4e07-4936-b378-f259f5b62baf",
            },
          },
        },
      ],
    };

    const { data: messageData, error: messageError } = await supabase
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

    console.log("Message data:", messageData);

    redirect(`/view-tutors/${parsedInput.tutorId}/contact/confirmation`);
  });

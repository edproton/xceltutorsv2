"use server";

import { actionClient } from "@/lib/safe-action";
import { tutoringFormSchema } from "./schema";
import { redirect } from "next/navigation";
import { GetAuthenticatedUserQuery } from "@/lib/queries/GetUserFromSupabase";
import { BookingDemoRequestCommand } from "@/lib/commands/BookingDemoRequestCommand ";

export const submitTutoringRequest = actionClient
  .schema(tutoringFormSchema)
  .action(async ({ parsedInput }) => {
    const {
      data: { user },
    } = await GetAuthenticatedUserQuery.execute();
    if (!user) {
      throw new Error("User not found");
    }

    const { error } = await BookingDemoRequestCommand.execute(
      {
        tutorId: parsedInput.tutorId,
        levelId: parsedInput.levelId,
        message: parsedInput.message,
        meetingDate: parsedInput.meetingDate,
        meetingTime: parsedInput.meetingTime,
      },
      user.id
    );

    if (error) {
      throw new Error(error);
    }

    redirect(`/view-tutors/${parsedInput.tutorId}/contact/confirmation`);
  });

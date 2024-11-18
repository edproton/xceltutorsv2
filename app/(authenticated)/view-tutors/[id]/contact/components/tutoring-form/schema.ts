import { z } from "zod";

export const tutoringFormSchema = z.object({
  tutorId: z.string().uuid("Invalid tutor ID"),
  levelId: z
    .number({
      required_error: "Subject and level are required",
    })
    .min(1, "Please select a level"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(20, "Please provide a message of at least 20 characters"),
  meetingDate: z.date({ required_error: "Please select a meeting date" }),
  meetingTime: z
    .string({ required_error: "Please select a meeting time" })
    .min(1, "Please select a meeting time"),
  frequency: z
    .enum(["weekly", "fortnightly", "monthly", "undecided"])
    .optional()
    .default("undecided"),
});

export type TutoringFormData = z.infer<typeof tutoringFormSchema>;

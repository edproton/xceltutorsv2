import { z } from "zod";

export const getBookingByIdSchema = z.object({
  bookingId: z.string(),
});

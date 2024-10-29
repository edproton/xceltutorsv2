// schemas/availability.ts
import { z } from "zod";

const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if times have minimum gap
const hasMinimumGap = (
  end: string,
  nextStart: string,
  minGapMinutes: number
): boolean => {
  const endMinutes = timeToMinutes(end);
  const startMinutes = timeToMinutes(nextStart);
  return startMinutes - endMinutes >= minGapMinutes;
};

// Helper function to check if time range has minimum duration
const hasMinimumDuration = (
  start: string,
  end: string,
  minDurationMinutes: number
): boolean => {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return endMinutes - startMinutes >= minDurationMinutes;
};

// Schema for a single time slot
const timeSlotSchema = z
  .object({
    timerange_start: z
      .string()
      .regex(TIME_REGEX, "Invalid time format. Use HH:mm"),
    timerange_end: z
      .string()
      .regex(TIME_REGEX, "Invalid time format. Use HH:mm"),
  })
  .refine(
    (data) => {
      // Special case for 23:00-23:59
      if (data.timerange_start === "23:00" && data.timerange_end === "23:59") {
        return true;
      }
      return hasMinimumDuration(data.timerange_start, data.timerange_end, 60);
    },
    {
      message:
        "Time slots must be at least 1 hour apart (except for 23:00-23:59)",
    }
  );

// Schema for a weekday's time slots
const weekdayTimeSlotsSchema = z.array(timeSlotSchema).refine(
  (timeSlots) => {
    if (timeSlots.length === 0) return true;

    // Sort time slots by start time
    const sortedSlots = [...timeSlots].sort(
      (a, b) =>
        timeToMinutes(a.timerange_start) - timeToMinutes(b.timerange_start)
    );

    // Check each consecutive pair of time slots
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentSlot = sortedSlots[i];
      const nextSlot = sortedSlots[i + 1];

      // Check if slots are properly ordered
      if (
        timeToMinutes(currentSlot.timerange_end) >=
        timeToMinutes(nextSlot.timerange_start)
      ) {
        return false;
      }

      // Check for minimum gap between slots (30 minutes)
      if (
        !hasMinimumGap(currentSlot.timerange_end, nextSlot.timerange_start, 30)
      ) {
        return false;
      }
    }

    return true;
  },
  {
    message:
      "Time slots must be ordered, not overlapping, and have at least 30 minutes between them",
  }
);

export const availabilitySchema = z.object({
  Monday: weekdayTimeSlotsSchema,
  Tuesday: weekdayTimeSlotsSchema,
  Wednesday: weekdayTimeSlotsSchema,
  Thursday: weekdayTimeSlotsSchema,
  Friday: weekdayTimeSlotsSchema,
  Saturday: weekdayTimeSlotsSchema,
  Sunday: weekdayTimeSlotsSchema,
});

export type AvailabilitySchema = z.infer<typeof availabilitySchema>;

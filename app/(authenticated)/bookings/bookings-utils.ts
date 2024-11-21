import { DateTime } from "luxon";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";

export function groupBookingsByDate(
  bookings: GetBookingsWithPaginationQueryResponseItem[]
) {
  return bookings.reduce((acc, booking) => {
    const key = getBookingGroup(DateTime.fromISO(booking.startTime));
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {} as Record<string, GetBookingsWithPaginationQueryResponseItem[]>);
}

function getBookingGroup(dateTime: DateTime): string {
  const today = DateTime.now().startOf("day");
  const tomorrow = today.plus({ days: 1 });
  const nextWeek = today.plus({ weeks: 1 });

  if (dateTime < today) {
    return "Past";
  } else if (dateTime < tomorrow) {
    return "Today";
  } else if (dateTime < tomorrow.plus({ days: 1 })) {
    return "Tomorrow";
  } else if (dateTime < nextWeek) {
    return "This Week";
  } else {
    return "Next Week";
  }
}

export function formatBookingDate(date: string): string {
  return DateTime.fromISO(date).toFormat("ccc dd LLL, HH:mm");
}

export function getBookingType(type: string): string {
  return type === "recurring" ? "Weekly lesson" : "One-time lesson";
}

import { Booking, BookingStatus, BookingType } from "./types";
import Bookings from "./bookings";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server";

const mockBookings: Booking[] = [
  {
    id: "1",
    studentName: "Reese B.",
    subject: "Maths GCSE",
    dateTime: DateTime.now()
      .plus({ days: 1 })
      .set({ hour: 17, minute: 0 })
      .toISO(),
    status: "Confirmed",
    isRecurring: true,
    bookingType: "Lesson",
  },
  {
    id: "2",
    studentName: "Leander B.",
    subject: "Maths IB",
    dateTime: DateTime.now()
      .plus({ days: 1 })
      .set({ hour: 19, minute: 0 })
      .toISO(),
    status: "Confirmed",
    isRecurring: true,
    bookingType: "Lesson",
  },
  {
    id: "3",
    studentName: "Tisha L.",
    subject: "Maths GCSE",
    dateTime: DateTime.now()
      .plus({ days: 2 })
      .set({ hour: 13, minute: 0 })
      .toISO(),
    status: "WaitingPayment",
    isRecurring: true,
    bookingType: "Lesson",
  },
  {
    id: "4",
    studentName: "Daniel B.",
    subject: "Maths IB",
    dateTime: DateTime.now()
      .plus({ days: 7 })
      .set({ hour: 8, minute: 0 })
      .toISO(),
    status: "WaitingPayment",
    isRecurring: true,
    bookingType: "Lesson",
  },
  {
    id: "5",
    studentName: "Emma S.",
    subject: "Physics A-Level",
    dateTime: DateTime.now()
      .plus({ days: 3 })
      .set({ hour: 16, minute: 30 })
      .toISO(),
    status: "PendingDate",
    isRecurring: false,
    bookingType: "Free Meeting",
  },
];

export default async function BookingsPage() {
  const supabase = await createClient();

  // const { data, error } = await supabase.from("bookings").select("*");

  // console.log(data, error);

  return (
    <div className="container mx-auto px-4">
      <Bookings bookings={mockBookings} />
    </div>
  );
}

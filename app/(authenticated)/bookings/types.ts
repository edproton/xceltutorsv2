export type BookingStatus =
  | "PendingDate"
  | "WaitingPayment"
  | "PaymentFailed"
  | "Confirmed"
  | "Canceled"
  | "Completed";

export type BookingType = "Free Meeting" | "Lesson";

export interface Booking {
  id: string;
  studentName: string;
  subject: string;
  dateTime: string;
  status: BookingStatus;
  isRecurring: boolean;
  bookingType: BookingType;
}

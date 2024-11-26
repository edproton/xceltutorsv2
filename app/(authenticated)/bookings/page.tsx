import { DialogProvider } from "@/contexts/dialog-context";
import LessonSchedule from "./components/lesson-scheduler";
import { getBookingsWithPaginationQuery } from "./actions";

export default async function BookingsPage() {
  const { bookings, currentUser } = await getBookingsWithPaginationQuery();
  return (
    <DialogProvider>
      <LessonSchedule rawBookings={bookings.items} role={currentUser.role} />
    </DialogProvider>
  );
}

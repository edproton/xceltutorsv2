import { create } from "zustand";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { BookingStatus } from "@/lib/types";

interface BookingsState {
  bookings: GetBookingsWithPaginationQueryResponseItem[];
  statusFilter: BookingStatus | "all";
  setBookings: (bookings: GetBookingsWithPaginationQueryResponseItem[]) => void;
  setStatusFilter: (status: BookingStatus | "all") => void;
  updateBooking: (
    bookingId: number,
    updates: Partial<GetBookingsWithPaginationQueryResponseItem>
  ) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: [],
  statusFilter: "all",
  setBookings: (bookings) => set({ bookings }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  updateBooking: (bookingId, updates) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      ),
    })),
}));

export const initializeBookingsStore = (
  initialBookings: GetBookingsWithPaginationQueryResponseItem[]
) => {
  useBookingsStore.getState().setBookings(initialBookings);
};

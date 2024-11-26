import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { BookingStatus } from "@/lib/types";
import { create } from "zustand";

interface BookingStore {
  selectedBooking: GetBookingsWithPaginationQueryResponseItem;
  setSelectedBooking: (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => void;
  updateBookingStatus: (bookingId: number, newStatus: BookingStatus) => void;
  bookings: GetBookingsWithPaginationQueryResponseItem[];
  setBookings: (bookings: GetBookingsWithPaginationQueryResponseItem[]) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedBooking: null!,
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  updateBookingStatus: (bookingId, newStatus) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ),
      selectedBooking:
        state.selectedBooking && state.selectedBooking.id === bookingId
          ? { ...state.selectedBooking, status: newStatus }
          : state.selectedBooking,
    })),
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
}));

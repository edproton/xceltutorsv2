import { create } from "zustand";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { BookingStatus, Role } from "@/lib/types";
import { DialogOption } from "../types";

interface BookingsState {
  bookings: GetBookingsWithPaginationQueryResponseItem[];
  statusFilter: BookingStatus | "all";
  selectedBooking: GetBookingsWithPaginationQueryResponseItem | null;
  openDialog: DialogOption | null;
  role: Role;
  setBookings: (bookings: GetBookingsWithPaginationQueryResponseItem[]) => void;
  setStatusFilter: (status: BookingStatus | "all") => void;
  updateBooking: (
    bookingId: number,
    updates: Partial<GetBookingsWithPaginationQueryResponseItem>
  ) => void;
  setSelectedBooking: (
    booking: GetBookingsWithPaginationQueryResponseItem | null
  ) => void;
  setOpenDialog: (dialog: DialogOption | null) => void;
  setRole: (role: Role) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: [],
  statusFilter: "all",
  selectedBooking: null,
  openDialog: null,
  role: "student",
  setBookings: (bookings) => set({ bookings }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  updateBooking: (bookingId, updates) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      ),
    })),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setOpenDialog: (dialog) => set({ openDialog: dialog }),
  setRole: (role) => set({ role }),
}));

export const initializeBookingsStore = (
  initialBookings: GetBookingsWithPaginationQueryResponseItem[],
  initialRole: Role
) => {
  const { setBookings, setRole } = useBookingsStore.getState();
  setBookings(initialBookings);
  setRole(initialRole);
};

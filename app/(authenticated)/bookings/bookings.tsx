"use client";

import { useState } from "react";

import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role, BookingStatus } from "@/lib/types";
import { groupBookingsByDate } from "./bookings-utils";
import { BookingsHeader } from "./components/bookings-header";
import { BookingsList } from "./components/bookings-list";
import BookingDialogs from "./components/dialogs/booking-dialogs";

type DialogType =
  | "confirmSchedule"
  | "confirmPayment"
  | "retryPayment"
  | "reschedule"
  | "cancel"
  | "confirm";

interface BookingsProps {
  bookings: GetBookingsWithPaginationQueryResponseItem[];
  oppositeParty: Profile;
  role: Role;
}

export default function Bookings({
  bookings,
  oppositeParty,
  role,
}: BookingsProps) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [selectedBooking, setSelectedBooking] =
    useState<GetBookingsWithPaginationQueryResponseItem | null>(null);
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);

  const groupedBookings = groupBookingsByDate(filteredBookings);

  const handleOpenDialog = (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialogType: DialogType
  ) => {
    setSelectedBooking(booking);
    setActiveDialog(dialogType);
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <BookingsHeader
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <BookingsList
          groupedBookings={groupedBookings}
          oppositeParty={oppositeParty}
          role={role}
          onOpenDialog={handleOpenDialog}
        />
        <BookingDialogs
          activeDialog={activeDialog}
          selectedBooking={selectedBooking}
          oppositeParty={oppositeParty}
          role={role}
          onCloseDialog={handleCloseDialog}
        />
      </main>
    </div>
  );
}

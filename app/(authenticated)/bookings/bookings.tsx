"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role, BookingStatus } from "@/lib/types";
import { BookingItem } from "./item/booking-item";
import { DialogOption, dialogOptions } from "./item/dialog-options";

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
  const [openDialog, setOpenDialog] = useState<DialogOption | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<GetBookingsWithPaginationQueryResponseItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );

  const handleOpenDialog = (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialog: DialogOption
  ) => {
    setSelectedBooking(booking);
    setOpenDialog(dialog);
  };

  const handleConfirmPayment = (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => {
    // Implement confirm payment logic here
    console.log("Confirming payment for booking:", booking.id);
  };

  const handleConfirmSchedule = (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => {
    // Implement confirm schedule logic here
    console.log("Confirming schedule for booking:", booking.id);
  };

  const onCancelLesson = (reason: string) => {
    console.log(
      `Lesson cancelled for ${selectedBooking?.createdBy.name}. Reason: ${reason}`
    );
    // Here you would typically call an API to cancel the lesson
  };

  const onSendConfirmation = (message: string) => {
    console.log(
      `Confirmation sent for ${selectedBooking?.createdBy.name}. Message: ${message}`
    );
    // Here you would typically call an API to send the confirmation
  };

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);

  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const key = getBookingGroup(DateTime.fromISO(booking.startTime));
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {} as Record<string, GetBookingsWithPaginationQueryResponseItem[]>);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <h1 className="mb-8 text-4xl font-bold">Bookings</h1>
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <Select
              onValueChange={(value) =>
                setStatusFilter(value as BookingStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Show all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show all</SelectItem>
                <SelectItem value="PendingDate">Pending Date</SelectItem>
                <SelectItem value="WaitingPayment">Waiting Payment</SelectItem>
                <SelectItem value="PaymentFailed">Payment Failed</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsContent value="upcoming" className="mt-6 space-y-8">
            {Object.entries(groupedBookings).map(([group, groupBookings]) => (
              <div key={group} className="space-y-4">
                <h2 className="text-lg font-semibold">{group}</h2>
                <div className="space-y-4">
                  {groupBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      oppositeParty={oppositeParty}
                      role={role}
                      onOpenDialog={handleOpenDialog}
                      onConfirmPayment={handleConfirmPayment}
                      onConfirmSchedule={handleConfirmSchedule}
                      dialogOptions={dialogOptions}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="previous">
            <div className="mt-6 text-center text-muted-foreground">
              No previous bookings found.
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {selectedBooking && openDialog && (
        <openDialog.component
          open={!!openDialog}
          onOpenChange={() => setOpenDialog(null)}
          booking={selectedBooking}
          oppositeParty={oppositeParty}
          onCancel={onCancelLesson}
          onSendConfirmation={onSendConfirmation}
        />
      )}
    </div>
  );
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

"use client";

import { useEffect } from "react";
import { DateTime } from "luxon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { Profile, Role, BookingStatus } from "@/lib/types";
import { BookingItem } from "./item/booking-item";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import {
  initializeBookingsStore,
  useBookingsStore,
} from "./store/bookingStore";

interface BookingsProps {
  initialBookings: GetBookingsWithPaginationQueryResponseItem[];
  oppositeParty: Profile;
  role: Role;
}

export default function Bookings({ initialBookings, role }: BookingsProps) {
  const { bookings, statusFilter, setStatusFilter, openDialog, setOpenDialog } =
    useBookingsStore();

  useEffect(() => {
    initializeBookingsStore(initialBookings, role);
  }, [initialBookings, role]);

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
                    <BookingItem key={booking.id} booking={booking} />
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
      {openDialog && (
        <Dialog
          open={true}
          onOpenChange={(open) => !open && setOpenDialog(null)}
        >
          <openDialog.component />
        </Dialog>
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

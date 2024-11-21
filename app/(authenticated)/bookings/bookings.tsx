"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { DateTime } from "luxon";
import RescheduleDialog from "./dialogs/reschedule-dialog";
import CancelDialog from "./dialogs/cancel-dialog";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { type BookingStatus } from "@/lib/types";

interface BookingsProps {
  bookings: GetBookingsWithPaginationQueryResponseItem[];
}

export default function Bookings({ bookings }: BookingsProps) {
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<GetBookingsWithPaginationQueryResponseItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );

  const handleReschedule = (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => {
    setSelectedBooking(booking);
    setIsRescheduleDialogOpen(true);
  };

  const handleCancel = (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const onCancelLesson = (reason: string) => {
    console.log(
      `Lesson cancelled for ${selectedBooking?.createdBy.name}. Reason: ${reason}`
    );
    // Here you would typically call an API to cancel the lesson
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
            {Object.entries(groupedBookings).map(([group, bookings]) => (
              <div key={group} className="space-y-4">
                <h2 className="text-lg font-semibold">{group}</h2>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {booking.createdBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {DateTime.fromISO(booking.startTime).toFormat(
                              "ccc dd LLL, HH:mm"
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {true ? "Weekly lesson" : "One-time lesson"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">
                          {booking.createdBy.name}
                        </span>
                        <span className="text-muted-foreground">
                          {booking.subject.name} {booking.subject.level.name}
                        </span>
                        <BookingStatus status={booking.status} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => handleReschedule(booking)}
                            >
                              Reschedule lesson
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleCancel(booking)}
                            >
                              Cancel lesson
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
      {selectedBooking && (
        <>
          <RescheduleDialog
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
            booking={selectedBooking}
          />
          <CancelDialog
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
            booking={selectedBooking}
            onCancel={onCancelLesson}
          />
        </>
      )}
    </div>
  );
}

function BookingStatus({ status }: { status: BookingStatus }) {
  switch (status) {
    case "Confirmed":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span className="text-sm">Confirmed</span>
        </div>
      );
    case "WaitingPayment":
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Waiting Payment</span>
        </div>
      );
    case "PendingDate":
      return (
        <div className="flex items-center text-blue-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Pending Date</span>
        </div>
      );
    case "PaymentFailed":
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-1 h-4 w-4" />
          <span className="text-sm">Payment Failed</span>
        </div>
      );
    case "Canceled":
      return (
        <div className="flex items-center text-gray-600">
          <XCircle className="mr-1 h-4 w-4" />
          <span className="text-sm">Canceled</span>
        </div>
      );
    case "Completed":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span className="text-sm">Completed</span>
        </div>
      );
    default:
      return null;
  }
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

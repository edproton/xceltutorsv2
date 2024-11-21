"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import RescheduleDialog from "./dialogs/reschedule-dialog";
import CancelDialog from "./dialogs/cancel-dialog";
import ConfirmationDialog from "./dialogs/confirmation-dialog";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role, type BookingStatus } from "@/lib/types";
import ConfirmPaymentDialog from "./dialogs/confirm-payment-dialog";
import TutorConfirmationDialog from "./dialogs/tutor-confirmation-dialog";

interface BookingsProps {
  bookings: GetBookingsWithPaginationQueryResponseItem[];
  oppositeParty: Profile;
  role: Role;
}

type DialogComponent = React.ComponentType<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: Profile;
  onCancel?: (reason: string) => void;
  onSendConfirmation?: (message: string) => void;
  onConfirmPayment?: (payNow: boolean) => void;
}>;

interface DialogOption {
  label: string;
  component: DialogComponent;
  roles: Role[];
}

const dialogOptions: DialogOption[] = [
  {
    label: "Reschedule lesson",
    component: RescheduleDialog,
    roles: ["tutor", "student"],
  },
  {
    label: "Cancel lesson",
    component: CancelDialog,
    roles: ["tutor", "student"],
  },
  {
    label: "Send confirmation",
    component: ConfirmationDialog,
    roles: ["tutor"],
  },
];

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
  const [isConfirmPaymentDialogOpen, setIsConfirmPaymentDialogOpen] =
    useState(false);
  const [isTutorConfirmationDialogOpen, setIsTutorConfirmationDialogOpen] =
    useState(false);

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
    setSelectedBooking(booking);
    setIsConfirmPaymentDialogOpen(true);
  };

  const handleConfirmSchedule = (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => {
    setSelectedBooking(booking);
    setIsTutorConfirmationDialogOpen(true);
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
                          <AvatarImage
                            src={oppositeParty.avatar}
                            alt={oppositeParty.name}
                          />
                          <AvatarFallback>
                            {oppositeParty.name
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
                          {oppositeParty.name}
                        </span>
                        <span className="text-muted-foreground">
                          {booking.subject.name} {booking.subject.level.name}
                        </span>
                        <BookingStatus status={booking.status} />
                        {role === "student" &&
                        booking.status === "AwaitingPayment" ? (
                          <Button onClick={() => handleConfirmPayment(booking)}>
                            Confirm
                          </Button>
                        ) : role === "tutor" &&
                          booking.status === "AwaitingTutorConfirmation" ? (
                          <Button
                            onClick={() => handleConfirmSchedule(booking)}
                          >
                            Confirm
                          </Button>
                        ) : null}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {dialogOptions
                              .filter((option) => option.roles.includes(role))
                              .map((option) => (
                                <DropdownMenuItem
                                  key={option.label}
                                  onSelect={() =>
                                    handleOpenDialog(booking, option)
                                  }
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
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
      {selectedBooking &&
        role === "student" &&
        selectedBooking.status === "AwaitingPayment" && (
          <ConfirmPaymentDialog
            open={isConfirmPaymentDialogOpen}
            onOpenChange={setIsConfirmPaymentDialogOpen}
            booking={selectedBooking}
            oppositeParty={oppositeParty}
          />
        )}

      {selectedBooking &&
        role === "tutor" &&
        selectedBooking.status === "AwaitingTutorConfirmation" && (
          <TutorConfirmationDialog
            open={isTutorConfirmationDialogOpen}
            bookingId={selectedBooking.id}
            onOpenChange={setIsTutorConfirmationDialogOpen}
            studentName={oppositeParty.name}
            onConfirm={() => setIsTutorConfirmationDialogOpen(false)}
            lessonDate={selectedBooking.startTime}
          />
        )}
    </div>
  );
}

function BookingStatus({ status }: { status: BookingStatus }) {
  switch (status) {
    case "Scheduled":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span className="text-sm">Scheduled</span>
        </div>
      );
    case "AwaitingPayment":
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Payment</span>
        </div>
      );
    case "AwaitingTutorConfirmation":
      return (
        <div className="flex items-center text-blue-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Tutor Confirmation</span>
        </div>
      );
    case "AwaitingStudentConfirmation":
      return (
        <div className="flex items-center text-orange-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Student Confirmation</span>
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

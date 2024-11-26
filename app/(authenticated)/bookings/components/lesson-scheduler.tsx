"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, AlertCircle, Clock, X, MoreVertical } from "lucide-react";
import { DateTime } from "luxon";
import { Badge } from "@/components/ui/badge";

import { BookingStatus } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { useDialog } from "@/contexts/dialog-context";
import { useBookingStore } from "../store/booking-store";
import {
  RescheduleDialog,
  CancelDialog,
  FeedbackDialog,
  ConfirmLessonDialog,
  PaymentDialog,
} from "./lesson-dialogs";
import React from "react";

export type Role = "tutor" | "student";

function getDateSection(date: DateTime): string {
  const now = DateTime.now().setZone("Europe/London");
  if (date.hasSame(now, "day")) {
    return "Today";
  } else if (date.hasSame(now.plus({ days: 1 }), "day")) {
    return "Tomorrow";
  } else if (date.weekNumber === now.weekNumber) {
    return "This week";
  } else if (date.weekNumber === now.plus({ weeks: 1 }).weekNumber) {
    return "Next week";
  } else {
    return "Upcoming";
  }
}

function getStatusIcon(status: BookingStatus) {
  switch (status) {
    case "Scheduled":
      return <Check className="w-4 h-4" />;
    case "AwaitingTutorConfirmation":
    case "AwaitingStudentConfirmation":
    case "AwaitingPayment":
      return <Clock className="w-4 h-4" />;
    case "PaymentFailed":
      return <AlertCircle className="w-4 h-4" />;
    case "Canceled":
      return <X className="w-4 h-4" />;
    case "Completed":
      return <Check className="w-4 h-4" />;
  }
}

function getStatusBadgeStyle(status: BookingStatus): string {
  switch (status) {
    case "Scheduled":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "AwaitingTutorConfirmation":
    case "AwaitingStudentConfirmation":
    case "AwaitingPayment":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "PaymentFailed":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Canceled":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "Completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  }
}

function LessonCard({
  booking,
  role,
}: {
  booking: GetBookingsWithPaginationQueryResponseItem;
  role: Role;
}) {
  const { showDialog } = useDialog();
  const { setSelectedBooking } = useBookingStore();

  const startTime = DateTime.fromISO(booking.startTime);
  const endTime = DateTime.fromISO(booking.endTime);

  const handleReschedule = () => {
    setSelectedBooking(booking);
    showDialog(<RescheduleDialog />);
  };

  const handleCancel = () => {
    setSelectedBooking(booking);
    showDialog(<CancelDialog />);
  };

  const handleFeedback = () => {
    setSelectedBooking(booking);
    showDialog(<FeedbackDialog />);
  };

  const getPrimaryAction = () => {
    switch (booking.status) {
      case "Scheduled":
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => (window.location.href = "/lesson-room")}
          >
            Launch
          </Button>
        );
      case "AwaitingTutorConfirmation":
        return role === "tutor" ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedBooking(booking);
              showDialog(<ConfirmLessonDialog role={role} />);
            }}
          >
            Confirm
          </Button>
        ) : null;
      case "AwaitingStudentConfirmation":
        return role === "student" ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedBooking(booking);
              showDialog(<ConfirmLessonDialog role={role} />);
            }}
          >
            Confirm
          </Button>
        ) : null;
      case "AwaitingPayment":
        return role === "student" ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedBooking(booking);
              showDialog(<PaymentDialog />);
            }}
          >
            Pay now
          </Button>
        ) : null;
      case "PaymentFailed":
        return role === "student" ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => (window.location.href = "/payment")}
          >
            Retry payment
          </Button>
        ) : null;
      default:
        return null;
    }
  };

  const getDropdownOptions = () => {
    const options = [];

    if (booking.status !== "Canceled" && booking.status !== "Completed") {
      if (role === "tutor") {
        options.push(
          <DropdownMenuItem key="reschedule" onSelect={handleReschedule}>
            Reschedule
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="cancel"
            onSelect={handleCancel}
            className="text-red-600"
          >
            Cancel lesson
          </DropdownMenuItem>
        );
      } else if (role === "student") {
        options.push(
          <DropdownMenuItem
            key="reschedule-request"
            onSelect={handleReschedule}
          >
            Request reschedule
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="cancel-request"
            onSelect={handleCancel}
            className="text-red-600"
          >
            Request cancellation
          </DropdownMenuItem>
        );
      }
    }

    if (booking.status === "Scheduled") {
      options.push(
        <DropdownMenuItem key="cant-make-it" onSelect={handleCancel}>
          Can&apos;t make it
        </DropdownMenuItem>
      );
    }

    if (booking.status === "Completed") {
      options.push(
        <DropdownMenuItem
          key="view-recording"
          onSelect={() => (window.location.href = "/lesson-recording")}
        >
          View recording
        </DropdownMenuItem>,
        <DropdownMenuItem key="leave-feedback" onSelect={handleFeedback}>
          Leave feedback
        </DropdownMenuItem>
      );
    }

    options.push(
      <DropdownMenuItem
        key="view-details"
        onSelect={() =>
          (window.location.href = `/lesson-details/${booking.id}`)
        }
      >
        View details
      </DropdownMenuItem>
    );

    return options;
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={booking.oppositeParty.avatar}
            alt={booking.oppositeParty.name}
          />
          <AvatarFallback>
            {booking.oppositeParty.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="font-semibold">{booking.oppositeParty.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {booking.subject.name} - {booking.subject.level.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">
          {startTime.toFormat("HH:mm")} - {endTime.toFormat("HH:mm")}
        </div>
        <Badge
          className={`${getStatusBadgeStyle(booking.status)}`}
          variant="secondary"
        >
          <span className="flex items-center gap-1">
            {getStatusIcon(booking.status)}
            {booking.status}
          </span>
        </Badge>
        {getPrimaryAction()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {getDropdownOptions()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function LessonSchedule({
  role,
  rawBookings,
}: {
  role: Role;
  rawBookings: GetBookingsWithPaginationQueryResponseItem[];
}) {
  const { bookings, setBookings } = useBookingStore();

  React.useEffect(() => {
    setBookings(rawBookings);
  }, [rawBookings, setBookings]);

  const groupedBookings = bookings.reduce((acc, booking) => {
    const startTime = DateTime.fromISO(booking.startTime);
    const section = getDateSection(startTime);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(booking);
    return acc;
  }, {} as Record<string, GetBookingsWithPaginationQueryResponseItem[]>);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      {Object.entries(groupedBookings).map(([section, sectionBookings]) => (
        <div key={section} className="space-y-4">
          <h2 className="text-2xl font-semibold">{section}</h2>
          <div className="space-y-4">
            {sectionBookings.map((booking) => (
              <LessonCard key={booking.id} booking={booking} role={role} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

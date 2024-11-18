"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MessageSquare,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type BookingStatus =
  | "PendingDate"
  | "WaitingPayment"
  | "PaymentFailed"
  | "Confirmed"
  | "Canceled"
  | "Completed";
type BookingType = "Free Meeting" | "Lesson" | "Group Lesson";
type ParticipantRole = "Student" | "Tutor";

interface Booking {
  id: string;
  tutorId: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  status: BookingStatus;
  conversationId: number;
  participantRole: ParticipantRole;
  levelName: string;
  subjectName: string;
  createdBy: {
    name: string;
  };
  price: number;
}

// Updated mock data
const mockBookings: Booking[] = [
  {
    id: "1",
    tutorId: "tutor1",
    startTime: "2023-11-20T14:00:00",
    endTime: "2023-11-20T15:00:00",
    type: "Lesson",
    status: "Confirmed",
    conversationId: 101,
    participantRole: "Student",
    levelName: "Intermediate",
    subjectName: "Mathematics",
    createdBy: { name: "John Doe" },
    price: 50,
  },
  {
    id: "2",
    tutorId: "tutor2",
    startTime: "2023-11-21T10:00:00",
    endTime: "2023-11-21T11:00:00",
    type: "Free Meeting",
    status: "PendingDate",
    conversationId: 102,
    participantRole: "Student",
    levelName: "Beginner",
    subjectName: "English",
    createdBy: { name: "Jane Smith" },
    price: 0,
  },
  {
    id: "3",
    tutorId: "tutor3",
    startTime: "2023-11-22T16:00:00",
    endTime: "2023-11-22T17:00:00",
    type: "Group Lesson",
    status: "Canceled",
    conversationId: 103,
    participantRole: "Tutor",
    levelName: "Advanced",
    subjectName: "Physics",
    createdBy: { name: "Alice Johnson" },
    price: 75,
  },
  {
    id: "4",
    tutorId: "tutor4",
    startTime: "2023-11-23T13:00:00",
    endTime: "2023-11-23T14:00:00",
    type: "Lesson",
    status: "WaitingPayment",
    conversationId: 104,
    participantRole: "Student",
    levelName: "Intermediate",
    subjectName: "Chemistry",
    createdBy: { name: "Bob Williams" },
    price: 60,
  },
  {
    id: "5",
    tutorId: "tutor5",
    startTime: "2023-11-24T11:00:00",
    endTime: "2023-11-24T12:00:00",
    type: "Lesson",
    status: "Completed",
    conversationId: 105,
    participantRole: "Student",
    levelName: "Advanced",
    subjectName: "Biology",
    createdBy: { name: "Charlie Brown" },
    price: 55,
  },
];

export default function Component() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<BookingType | "all">("all");

  const filteredBookings = mockBookings.filter(
    (booking) =>
      (statusFilter === "all" || booking.status === statusFilter) &&
      (typeFilter === "all" || booking.type === typeFilter)
  );

  const formatDateTime = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toLocaleString(DateTime.DATETIME_MED);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "PendingDate":
        return "bg-yellow-500";
      case "WaitingPayment":
        return "bg-blue-500";
      case "PaymentFailed":
        return "bg-red-500";
      case "Canceled":
        return "bg-gray-500";
      case "Completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: BookingType) => {
    switch (type) {
      case "Free Meeting":
        return "🆓";
      case "Lesson":
        return "📚";
      case "Group Lesson":
        return "👥";
      default:
        return "📅";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Bookings</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as BookingStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PendingDate">Pending Date</SelectItem>
              <SelectItem value="WaitingPayment">Waiting Payment</SelectItem>
              <SelectItem value="PaymentFailed">Payment Failed</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as BookingType | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Free Meeting">Free Meeting</SelectItem>
              <SelectItem value="Lesson">Lesson</SelectItem>
              <SelectItem value="Group Lesson">Group Lesson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>
                  {getTypeIcon(booking.type)} {booking.type}
                </span>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </CardTitle>
              <CardDescription>Booking #{booking.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDateTime(booking.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {DateTime.fromISO(booking.startTime).toFormat("HH:mm")} -
                  {DateTime.fromISO(booking.endTime).toFormat("HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>You are the {booking.participantRole}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{booking.levelName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{booking.subjectName}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.price === 0
                    ? "Free"
                    : `$${booking.price.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Created by: {booking.createdBy.name}</span>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link
                href={`/conversations/${booking.conversationId}`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Conversation
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {filteredBookings.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No bookings found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

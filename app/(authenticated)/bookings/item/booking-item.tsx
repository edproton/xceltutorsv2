import { DateTime } from "luxon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { BookingStatusBadge } from "./booking-status-badge";
import { useBookingsStore } from "../store/bookingStore";
import { useDropdownDialogOptions } from "../dropdown-options-dialogs";
import { QuickAction } from "../quick-options-dialogs";

interface BookingItemProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
}

export function BookingItem({ booking }: BookingItemProps) {
  const { role } = useBookingsStore();
  const { availableDialogOptions, handleOpenDialog } =
    useDropdownDialogOptions(booking);

  const oppositeParty =
    role === "student" ? booking.forTutor : booking.createdBy;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={oppositeParty.avatar} alt={oppositeParty.name} />
          <AvatarFallback>
            {oppositeParty.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">
            {DateTime.fromISO(booking.startTime).toFormat("ccc dd LLL, HH:mm")}
          </div>
          <div className="text-sm text-muted-foreground">
            {true ? "Weekly lesson" : "One-time lesson"}
          </div>
          <div className="text-sm text-muted-foreground">{booking.type}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium">{oppositeParty.name}</span>
        <span className="text-muted-foreground">
          {booking.subject.name} {booking.subject.level.name}
        </span>
        <BookingStatusBadge status={booking.status} />
        <QuickAction booking={booking} />
        {availableDialogOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableDialogOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onSelect={() => handleOpenDialog(option)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

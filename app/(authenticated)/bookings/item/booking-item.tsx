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
import { Role } from "@/lib/types";
import { DialogOption, dialogOptions } from "./dialog-options";
import { QuickActionButton } from "./quick-action-button";
import { BookingStatusBadge } from "./booking-status-badge";

interface BookingItemProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  role: Role;
  onOpenDialog: (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialog: DialogOption
  ) => void;
}

export function BookingItem({ booking, role, onOpenDialog }: BookingItemProps) {
  const availableDialogOptions = dialogOptions.filter(
    (option) =>
      option.roles.includes(role) &&
      (!option.status || option.status.includes(booking.status))
  );

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
        <QuickActionButton role={role} booking={booking} />
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
                  onSelect={() => onOpenDialog(booking, option)}
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

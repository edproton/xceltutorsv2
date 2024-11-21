import { DateTime } from "luxon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingStatusBadge } from "./booking-status-badge";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role, BookingStatus } from "@/lib/types";
import { BookingDialogOptions } from "./booking-dialog-options";

type DialogAction =
  | "confirmSchedule"
  | "confirmPayment"
  | "retryPayment"
  | "reschedule"
  | "cancel"
  | "confirm";

interface BookingsListProps {
  groupedBookings: Record<string, GetBookingsWithPaginationQueryResponseItem[]>;
  oppositeParty: Profile;
  role: Role;
  onOpenDialog: (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialogType: DialogAction
  ) => void;
}

export function BookingsList({
  groupedBookings,
  oppositeParty,
  role,
  onOpenDialog,
}: BookingsListProps) {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="previous">Previous</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-6 space-y-8">
        {Object.entries(groupedBookings).map(([group, bookings]) => (
          <div key={group} className="space-y-4">
            <h2 className="text-lg font-semibold">{group}</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  oppositeParty={oppositeParty}
                  role={role}
                  onOpenDialog={onOpenDialog}
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
  );
}

interface BookingItemProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: Profile;
  role: Role;
  onOpenDialog: (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialogType: DialogAction
  ) => void;
}

function BookingItem({
  booking,
  oppositeParty,
  role,
  onOpenDialog,
}: BookingItemProps) {
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
        <ActionButton
          booking={booking}
          role={role}
          onOpenDialog={onOpenDialog}
        />
        <BookingDialogOptions
          booking={booking}
          role={role}
          onOpenDialog={onOpenDialog}
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  role: Role;
  onOpenDialog: (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialogType: DialogAction
  ) => void;
}

function ActionButton({ booking, role, onOpenDialog }: ActionButtonProps) {
  const status = booking.status as BookingStatus;

  switch (status) {
    case "AwaitingPayment":
      if (role === "student") {
        return (
          <Button onClick={() => onOpenDialog(booking, "confirmPayment")}>
            Confirm Payment
          </Button>
        );
      }
      break;
    case "AwaitingTutorConfirmation":
      if (role === "tutor") {
        return (
          <Button onClick={() => onOpenDialog(booking, "confirmSchedule")}>
            Confirm Schedule
          </Button>
        );
      }
      break;
    case "AwaitingStudentConfirmation":
      if (role === "student") {
        return (
          <Button onClick={() => onOpenDialog(booking, "confirmSchedule")}>
            Confirm Schedule
          </Button>
        );
      }
      break;
    case "PaymentFailed":
      if (role === "student") {
        return (
          <Button onClick={() => onOpenDialog(booking, "retryPayment")}>
            Retry Payment
          </Button>
        );
      }
      break;
  }

  return null;
}

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Role, BookingStatus, Profile } from "@/lib/types";
import BookingDialogs from "./dialogs/booking-dialogs";

type DialogType =
  | "confirmSchedule"
  | "confirmPayment"
  | "retryPayment"
  | "reschedule"
  | "cancel"
  | "confirm";

interface BookingActionsProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  role: Role;
  oppositeParty: Profile;
}

export function BookingActions({
  booking,
  role,
  oppositeParty,
}: BookingActionsProps) {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);

  const handleOpenDialog = useCallback((dialogType: DialogType) => {
    setActiveDialog(dialogType);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const renderActionButton = () => {
    const status = booking.status as BookingStatus;

    switch (status) {
      case "AwaitingPayment":
        if (role === "student") {
          return (
            <Button onClick={() => handleOpenDialog("confirmPayment")}>
              Confirm Payment
            </Button>
          );
        }
        break;
      case "AwaitingTutorConfirmation":
        if (role === "tutor") {
          return (
            <Button onClick={() => handleOpenDialog("confirmSchedule")}>
              Confirm Schedule
            </Button>
          );
        }
        break;
      case "AwaitingStudentConfirmation":
        if (role === "student") {
          return (
            <Button onClick={() => handleOpenDialog("confirmSchedule")}>
              Confirm Schedule
            </Button>
          );
        }
        break;
      case "PaymentFailed":
        if (role === "student") {
          return (
            <Button onClick={() => handleOpenDialog("retryPayment")}>
              Retry Payment
            </Button>
          );
        }
        break;
    }

    return renderDropdownMenu();
  };

  const renderDropdownMenu = () => {
    const dialogOptions: Array<{
      label: string;
      value: DialogType;
      roles: Role[];
    }> = [
      {
        label: "Reschedule lesson",
        value: "reschedule",
        roles: ["tutor", "student"],
      },
      { label: "Cancel lesson", value: "cancel", roles: ["tutor", "student"] },
      { label: "Send confirmation", value: "confirm", roles: ["tutor"] },
    ];

    return (
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
                key={option.value}
                onSelect={() => handleOpenDialog(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      {renderActionButton()}
      <BookingDialogs
        activeDialog={activeDialog}
        selectedBooking={booking}
        oppositeParty={oppositeParty}
        role={role}
        onCloseDialog={handleCloseDialog}
      />
    </>
  );
}

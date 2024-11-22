"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatus, Role } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import ConfirmPaymentDialog from "../dialogs/confirm-payment-dialog";
import TutorConfirmationDialog from "../dialogs/tutor-confirmation-dialog";

interface QuickActionButtonProps {
  role: Role;
  status: BookingStatus;
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: {
    name: string;
  };
  onActionComplete: (
    booking: GetBookingsWithPaginationQueryResponseItem
  ) => void;
}

interface QuickAction {
  roles: Role[];
  status: BookingStatus[];
  action: string;
  dialog: React.ComponentType<any>;
}

export const quickActions: QuickAction[] = [
  {
    roles: ["student"],
    status: ["AwaitingPayment"],
    action: "Confirm Payment",
    dialog: ConfirmPaymentDialog,
  },
  {
    roles: ["tutor"],
    status: ["AwaitingTutorConfirmation"],
    action: "Confirm Schedule",
    dialog: TutorConfirmationDialog,
  },
];

export function QuickActionButton({
  role,
  status,
  booking,
  oppositeParty,
  onActionComplete,
}: QuickActionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const action = quickActions.find(
    (action) => action.roles.includes(role) && action.status.includes(status)
  );

  if (!action) {
    return null;
  }

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Implement the confirmation logic here
    console.log(`Confirmed ${action.action} for booking:`, booking.id);
    setIsDialogOpen(false);
    onActionComplete(booking);
  };

  const DialogComponent = action.dialog;

  return (
    <>
      <Button onClick={handleClick}>{action.action}</Button>
      <DialogComponent
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        booking={booking}
        oppositeParty={oppositeParty}
        onConfirm={handleConfirm}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatus, Role } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import ConfirmPaymentDialog from "../quick-options-dialogs/confirm-payment-dialog";
import TutorConfirmationDialog from "../quick-options-dialogs/tutor-confirmation-dialog";
import { DialogProps } from "../dropdown-options-dialogs";

interface QuickActionButtonProps {
  role: Role;
  booking: GetBookingsWithPaginationQueryResponseItem;
}

interface QuickAction {
  roles: Role[];
  status: BookingStatus[];
  action: string;
  dialog: React.ComponentType<DialogProps>;
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

export function QuickActionButton({ role, booking }: QuickActionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const action = quickActions.find(
    (action) =>
      action.roles.includes(role) && action.status.includes(booking.status)
  );

  if (!action) {
    return null;
  }

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const DialogComponent = action.dialog;

  return (
    <>
      <Button onClick={handleClick}>{action.action}</Button>
      <DialogComponent
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        booking={booking}
      />
    </>
  );
}

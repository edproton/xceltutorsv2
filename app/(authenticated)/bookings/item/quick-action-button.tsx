"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatus, Role } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import ConfirmPaymentDialog from "../dialogs/confirm-payment-dialog";
import TutorConfirmationDialog from "../dialogs/tutor-confirmation-dialog";
import { DialogProps } from "./dialog-options";

interface QuickActionButtonProps {
  role: Role;
  status: BookingStatus;
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

export function QuickActionButton({
  role,
  status,
  booking,
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

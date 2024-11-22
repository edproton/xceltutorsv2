"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import ConfirmPaymentDialog from "./confirm-payment-dialog";
import TutorConfirmationDialog from "./tutor-confirmation-dialog";
import { useBookingsStore } from "../store/bookingStore";
import { DialogOption } from "../types";
import StudentConfirmationDialog from "./student-confirmation-dialog";

interface QuickActionProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  children?: ReactNode;
  triggerComponent?: ReactNode;
  showTooltip?: boolean;
}

interface QuickAction extends DialogOption {
  action: string;
}

export const quickActions: QuickAction[] = [
  {
    roles: ["student"],
    status: ["AwaitingPayment"],
    action: "Confirm Payment",
    label: "Confirm Payment",
    component: ConfirmPaymentDialog,
  },
  {
    roles: ["tutor"],
    status: ["AwaitingTutorConfirmation"],
    action: "Confirm Schedule",
    label: "Confirm Schedule",
    component: TutorConfirmationDialog,
  },
  {
    roles: ["student"],
    status: ["AwaitingStudentConfirmation"],
    action: "Confirm Schedule",
    label: "Confirm Schedule",
    component: StudentConfirmationDialog,
  },
];

export function QuickAction({
  booking,
  children,
  triggerComponent,
  showTooltip = false,
}: QuickActionProps) {
  const { role, setSelectedBooking, setOpenDialog } = useBookingsStore();

  const action = quickActions.find(
    (action) =>
      action.roles.includes(role) && action.status.includes(booking.status)
  );

  if (!action) {
    return null;
  }

  const handleClick = () => {
    setSelectedBooking(booking);
    setOpenDialog({
      component: action.component,
      label: action.label,
      roles: action.roles,
      status: action.status,
    });
  };

  const content = children || action.action;

  const trigger = triggerComponent ? (
    <div onClick={handleClick}>{triggerComponent}</div>
  ) : (
    <Button onClick={handleClick}>{content}</Button>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent>
            <p>{action.action}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return trigger;
}

export function useQuickAction(
  booking: GetBookingsWithPaginationQueryResponseItem
) {
  const { role } = useBookingsStore();

  const availableQuickAction = quickActions.find(
    (action) =>
      action.roles.includes(role) && action.status.includes(booking.status)
  );

  return availableQuickAction;
}

export const initializeBookingsStore = (
  initialBookings: GetBookingsWithPaginationQueryResponseItem[],
  initialRole: Role
) => {
  const { setBookings, setRole } = useBookingsStore.getState();
  setBookings(initialBookings);
  setRole(initialRole);
};

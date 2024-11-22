import { BookingStatus, Role } from "@/lib/types";
import CancelDialog from "../dropdown-options/cancel-dialog";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import ResendConfirmationMessageDialog from "../dropdown-options/resend-confirmation-message-dialog";
import RescheduleDialog from "../dropdown-options/reschedule-dialog";

export interface DialogOption {
  label: string;
  component: React.ComponentType<DialogProps>;
  roles: Role[];
  status?: BookingStatus[];
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: GetBookingsWithPaginationQueryResponseItem;
}

export const dropdownOptions: DialogOption[] = [
  {
    label: "Reschedule lesson",
    component: RescheduleDialog,
    roles: ["tutor", "student"],
    status: [
      "AwaitingPayment",
      "AwaitingStudentConfirmation",
      "AwaitingTutorConfirmation",
      "Scheduled",
    ],
  },
  {
    label: "Cancel lesson",
    component: CancelDialog,
    roles: ["tutor", "student"],
    status: [
      "AwaitingPayment",
      "AwaitingTutorConfirmation",
      "AwaitingStudentConfirmation",
      "Scheduled",
      "PaymentFailed",
    ],
  },
  {
    label: "Resend confirmation",
    component: ResendConfirmationMessageDialog,
    roles: ["tutor"],
    status: ["AwaitingStudentConfirmation", "AwaitingPayment"],
  },
];

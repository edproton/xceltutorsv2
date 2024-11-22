import { BookingStatus, Role } from "@/lib/types";
import CancelDialog from "../dialogs/cancel-dialog";
import ConfirmationDialog from "../dialogs/confirmation-dialog";
import RescheduleDialog from "../dialogs/reschedule-dialog";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";

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

export const dialogOptions: DialogOption[] = [
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
    label: "Send confirmation",
    component: ConfirmationDialog,
    roles: ["tutor"],
    status: ["AwaitingStudentConfirmation", "AwaitingPayment"],
  },
];

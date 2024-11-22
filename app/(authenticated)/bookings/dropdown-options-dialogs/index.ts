import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import RescheduleDialog from "./reschedule-dialog";
import { useBookingsStore } from "../store/bookingStore";
import CancelDialog from "./cancel-dialog";
import ResendConfirmationMessageDialog from "./resend-confirmation-message-dialog";
import { DialogOption } from "../types";

export const dropdownDialogOptions: DialogOption[] = [
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

export function useDropdownDialogOptions(
  booking: GetBookingsWithPaginationQueryResponseItem
) {
  const { role, setOpenDialog, setSelectedBooking } = useBookingsStore();

  const availableDialogOptions = dropdownDialogOptions.filter(
    (option) =>
      option.roles.includes(role) && option.status.includes(booking.status)
  );

  const handleOpenDialog = (option: DialogOption) => {
    setSelectedBooking(booking);
    setOpenDialog(option);
  };

  return { availableDialogOptions, handleOpenDialog };
}

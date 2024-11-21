import { BookingStatus, Role } from "@/lib/types";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";

export type DialogType =
  | "confirmSchedule"
  | "confirmPayment"
  | "retryPayment"
  | "reschedule"
  | "cancel"
  | "confirm";

export interface DialogOption {
  label: string;
  value: DialogType;
  roles: Role[];
}

export function getAvailableDialogOptions(
  booking: GetBookingsWithPaginationQueryResponseItem,
  role: Role
): DialogOption[] {
  const status = booking.status as BookingStatus;
  const baseOptions: DialogOption[] = [
    {
      label: "Reschedule lesson",
      value: "reschedule",
      roles: ["tutor", "student"],
    },
    {
      label: "Cancel lesson",
      value: "cancel",
      roles: ["tutor", "student"],
    },
  ];

  switch (status) {
    case "AwaitingTutorConfirmation":
      if (role === "tutor") {
        return [
          ...baseOptions,
          {
            label: "Confirm Schedule",
            value: "confirmSchedule",
            roles: ["tutor"],
          },
        ];
      }
      break;
    case "AwaitingStudentConfirmation":
      if (role === "student") {
        return [
          ...baseOptions,
          {
            label: "Confirm Schedule",
            value: "confirmSchedule",
            roles: ["student"],
          },
        ];
      }
      break;
    case "AwaitingPayment":
      if (role === "student") {
        return [
          ...baseOptions,
          {
            label: "Confirm Payment",
            value: "confirmPayment",
            roles: ["student"],
          },
        ];
      }
      break;
    case "PaymentFailed":
      if (role === "student") {
        return [
          ...baseOptions,
          { label: "Retry Payment", value: "retryPayment", roles: ["student"] },
        ];
      }
      break;
    case "Scheduled":
      if (role === "tutor") {
        return [
          ...baseOptions,
          { label: "Send confirmation", value: "confirm", roles: ["tutor"] },
        ];
      }
      return baseOptions;
    case "Canceled":
    case "Completed":
      return [];
  }

  return baseOptions;
}

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role } from "@/lib/types";
import { CancelDialogContent } from "./dialogs-content/cancel";
import { ConfirmPaymentDialogContent } from "./dialogs-content/confirm-payment";
import { ConfirmationDialogContent } from "./dialogs-content/confirmation";
import { RescheduleDialogContent } from "./dialogs-content/reschedule";
import { RetryPaymentDialogContent } from "./dialogs-content/retry-payment";
import { StudentConfirmationDialogContent } from "./dialogs-content/student-confirmation";
import { TutorConfirmationDialogContent } from "./dialogs-content/tutor-confirmation";
import { BookingDialogProps } from "./booking-dialog-props";
import {
  DialogType,
  getAvailableDialogOptions,
} from "../booking-dialogs-shared";

interface BookingDialogsProps {
  activeDialog: DialogType | null;
  selectedBooking: GetBookingsWithPaginationQueryResponseItem | null;
  oppositeParty: Profile;
  role: Role;
  onCloseDialog: () => void;
}

export default function BookingDialogs({
  activeDialog,
  selectedBooking,
  oppositeParty,
  role,
  onCloseDialog,
}: BookingDialogsProps) {
  if (!selectedBooking) return null;

  const commonProps: BookingDialogProps = {
    open: !!activeDialog,
    onOpenChange: onCloseDialog,
    booking: selectedBooking,
    oppositeParty,
    role,
  };

  const availableDialogs = getAvailableDialogOptions(selectedBooking, role);

  const renderDialogContent = () => {
    const dialogOption = availableDialogs.find(
      (option) => option.value === activeDialog
    );

    if (!dialogOption) {
      return <UnknownDialog />;
    }

    switch (dialogOption.value) {
      case "confirmSchedule":
        return (
          <>
            <DialogTitle>Confirm Schedule</DialogTitle>
            {role === "tutor" ? (
              <TutorConfirmationDialogContent {...commonProps} />
            ) : (
              <StudentConfirmationDialogContent {...commonProps} />
            )}
          </>
        );
      case "confirmPayment":
        return (
          <>
            <DialogTitle>Confirm Payment</DialogTitle>
            <ConfirmPaymentDialogContent {...commonProps} />
          </>
        );
      case "retryPayment":
        return (
          <>
            <DialogTitle>Retry Payment</DialogTitle>
            <RetryPaymentDialogContent {...commonProps} />
          </>
        );
      case "reschedule":
        return (
          <>
            <DialogTitle>Reschedule Lesson</DialogTitle>
            <RescheduleDialogContent {...commonProps} />
          </>
        );
      case "cancel":
        return (
          <>
            <DialogTitle>Cancel Lesson</DialogTitle>
            <CancelDialogContent {...commonProps} />
          </>
        );
      case "confirm":
        return (
          <>
            <DialogTitle>Confirm Lesson</DialogTitle>
            <ConfirmationDialogContent {...commonProps} />
          </>
        );
    }
  };

  return (
    <Dialog open={!!activeDialog} onOpenChange={onCloseDialog}>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  );
}

function UnknownDialog() {
  return (
    <>
      <DialogTitle>Unknown Dialog</DialogTitle>
      <p>
        The dialog you are trying to open is not supported. Please contact
        support.
      </p>
    </>
  );
}

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { DateTime } from "luxon";
import { BookingDialogProps } from "../booking-dialog-props";

export function StudentConfirmationDialogContent({
  booking,
  oppositeParty,
  onOpenChange,
}: BookingDialogProps) {
  const handleConfirm = async () => {
    // Implement confirmation logic here
    console.log("Student confirming booking:", booking.id);
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Confirm Lesson with {oppositeParty.name}</DialogTitle>
        <DialogDescription>
          Please confirm that you want to proceed with this lesson.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-2 py-4">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <span>
          {DateTime.fromISO(booking.startTime).toFormat(
            "EEEE, MMMM d, yyyy 'at' h:mm a"
          )}
        </span>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="default">
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm Lesson
        </Button>
      </DialogFooter>
    </>
  );
}

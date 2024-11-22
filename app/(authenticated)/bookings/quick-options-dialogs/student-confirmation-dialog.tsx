import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { studentConfirmationBookingQuery } from "../actions";
import { toast } from "@/hooks/use-toast";
import { useBookingsStore } from "../store/bookingStore";
import { DialogProps } from "../dropdown-options-dialogs";

export default function StudentConfirmationDialog({
  open,
  onOpenChange,
  booking,
}: DialogProps) {
  const updateBooking = useBookingsStore((state) => state.updateBooking);
  const handleConfirm = async () => {
    const result = await studentConfirmationBookingQuery({
      bookingId: booking.id,
    });

    if (result?.serverError) {
      toast({
        title: "Error",
        description: result.serverError,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Schedule Confirmed",
        description: `You have successfully confirmed the lesson with ${booking.createdBy.name}.`,
        variant: "success",
      });

      updateBooking(booking.id, { status: "AwaitingPayment" });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Confirm Schedule with {booking.forTutor.name}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm this lesson schedule?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 py-4">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span>{booking.endTime}</span>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="success">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

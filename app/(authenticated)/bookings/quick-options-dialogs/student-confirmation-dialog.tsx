import { Button } from "@/components/ui/button";
import {
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

export default function StudentConfirmationDialog() {
  const { selectedBooking, updateBooking, setOpenDialog } = useBookingsStore();

  const handleConfirm = async () => {
    if (!selectedBooking) return;

    const result = await studentConfirmationBookingQuery({
      bookingId: selectedBooking.id,
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
        description: `You have successfully confirmed the lesson with ${selectedBooking.createdBy.name}.`,
        variant: "success",
      });

      updateBooking(selectedBooking.id, {
        status: "AwaitingTutorConfirmation",
      });
    }

    setOpenDialog(null);
  };

  if (!selectedBooking) return null;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          Confirm Schedule with {selectedBooking.forTutor.name}
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to confirm this lesson schedule?
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-2 py-4">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <span>{selectedBooking.endTime}</span>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpenDialog(null)}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="success">
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm Schedule
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

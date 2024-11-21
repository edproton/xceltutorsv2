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
import { confirmAwaitingPaymentBookingQuery } from "../actions";
import { toast } from "@/hooks/use-toast";

interface TutorConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  lessonDate: string;
  onConfirm: () => void;
  bookingId: number;
}

export default function TutorConfirmationDialog({
  open,
  onOpenChange,
  studentName,
  lessonDate,
  onConfirm,
  bookingId,
}: TutorConfirmationDialogProps) {
  const handleConfirm = async () => {
    const result = await confirmAwaitingPaymentBookingQuery({
      bookingId,
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
        description: `You have successfully confirmed the lesson with ${studentName}.`,
        variant: "success",
      });

      onConfirm();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Schedule with {studentName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm this lesson schedule?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 py-4">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span>{lessonDate}</span>
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

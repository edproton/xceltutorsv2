import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/contexts/dialog-context";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { useBookingStore } from "../store/booking-store";
import { tutorConfirmationBookingQuery } from "../actions";
import { Role } from "@/lib/types";

export const RescheduleDialog: React.FC = () => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Reschedule Lesson</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-date" className="text-right">
            New Date
          </Label>
          <Input id="new-date" type="datetime-local" className="col-span-3" />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Lesson Rescheduled",
              description: "The lesson has been rescheduled.",
            });
            closeDialog();
          }}
        >
          Reschedule
        </Button>
      </div>
    </div>
  );
};

export const CancelDialog: React.FC = () => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Cancel Lesson</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reason" className="text-right">
            Reason
          </Label>
          <Textarea
            id="reason"
            className="col-span-3"
            placeholder="Please provide a reason for cancellation"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeDialog}>
          Keep Lesson
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              title: "Lesson Canceled",
              description: "The lesson has been canceled.",
              variant: "destructive",
            });
            closeDialog();
          }}
        >
          Cancel Lesson
        </Button>
      </div>
    </div>
  );
};

export const FeedbackDialog: React.FC = () => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Leave Feedback</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="feedback" className="text-right">
            Feedback
          </Label>
          <Textarea
            id="feedback"
            className="col-span-3"
            placeholder="Please provide your feedback for the lesson"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Feedback Submitted",
              description: "Thank you for your feedback!",
            });
            closeDialog();
          }}
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );
};

export const ConfirmLessonDialog: React.FC<{
  role: Role;
}> = ({ role }) => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const { selectedBooking, updateBookingStatus } = useBookingStore();

  const handleConfirm = async () => {
    const result = await tutorConfirmationBookingQuery({
      bookingId: selectedBooking!.id,
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

      if (role === "tutor") {
        updateBookingStatus(selectedBooking.id, "AwaitingStudentConfirmation");
      } else {
        updateBookingStatus(selectedBooking.id, "AwaitingTutorConfirmation");
      }
    }
    toast({ title: "Lesson Confirmed" });
    closeDialog();
  };
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Confirm Lesson</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to confirm this lesson?</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </div>
    </div>
  );
};

export const PaymentDialog: React.FC = () => {
  const { closeDialog } = useDialog();
  const selectedBooking = useBookingStore((state) => state.selectedBooking);

  if (!selectedBooking) return null;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Pay for Lesson</DialogTitle>
      </DialogHeader>
      <p>
        You are about to pay for this lesson. Do you want to proceed to the
        payment page?
      </p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <form action="/api/payment" method="POST">
          <input type="hidden" name="bookingId" value={selectedBooking.id} />
          <Button type="submit" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Confirm & Pay
          </Button>
        </form>
      </div>
    </div>
  );
};

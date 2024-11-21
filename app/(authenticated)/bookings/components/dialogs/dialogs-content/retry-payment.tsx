import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { BookingDialogProps } from "../booking-dialog-props";

export function RetryPaymentDialogContent({
  booking,
  onOpenChange,
}: BookingDialogProps) {
  const handleRetryPayment = async () => {
    // Implement retry payment logic here
    console.log("Retrying payment for booking:", booking.id);
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Retry Payment</DialogTitle>
        <DialogDescription>
          Your previous payment attempt failed. Please try again to confirm your
          booking.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">
          Booking details: {booking.subject.name} lesson on{" "}
          {new Date(booking.startTime).toLocaleDateString()}
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleRetryPayment} variant="default">
          <CreditCard className="mr-2 h-4 w-4" />
          Retry Payment
        </Button>
      </DialogFooter>
    </>
  );
}

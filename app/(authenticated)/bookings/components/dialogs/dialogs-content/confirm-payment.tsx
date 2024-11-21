import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Clock } from "lucide-react";
import { BookingDialogProps } from "../booking-dialog-props";

export function ConfirmPaymentDialogContent({
  onOpenChange,
}: BookingDialogProps) {
  const handleConfirmAndPayLater = () => {
    // Implement confirm and pay later logic here
    console.log("Confirming booking and paying later");
    onOpenChange(false);
  };

  const handleConfirmAndPay = () => {
    // Implement confirm and pay logic here
    console.log("Confirming booking and paying now");
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogDescription>
          {`Choose how you'd like to proceed with your booking.`}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Button onClick={handleConfirmAndPay} className="w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          Confirm & Pay
        </Button>
        <Button
          onClick={handleConfirmAndPayLater}
          variant="outline"
          className="w-full"
        >
          <Clock className="mr-2 h-4 w-4" />
          Confirm & Pay Later
        </Button>
        <p className="text-sm text-muted-foreground">
          {`By selecting "Confirm & Pay Later", your lesson will be in "Waiting
          for Payment" status. You'll have 12 hours before the lesson to
          complete the payment.`}
        </p>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </DialogFooter>
    </>
  );
}

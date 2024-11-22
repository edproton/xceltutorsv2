import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Clock } from "lucide-react";
import { DialogProps } from "../dropdown-options-dialogs";

export default function ConfirmPaymentDialog({
  open,
  onOpenChange,
  booking,
}: DialogProps) {
  const handleConfirmAndPayLater = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            {`Choose how you'd like to proceed with your booking.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form action="/api/payment" method="POST">
            <input type="hidden" name="bookingId" value={booking.id} />
            <Button className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Confirm & Pay
            </Button>
          </form>
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
      </DialogContent>
    </Dialog>
  );
}

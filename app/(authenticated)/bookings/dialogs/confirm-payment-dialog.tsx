import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile } from "@/lib/types";
import { CreditCard, Clock, Calendar, User, X } from "lucide-react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeEmbeddedCheckoutOptions } from "@stripe/stripe-js";
import env from "@/env";
import { format } from "date-fns";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

interface ConfirmPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: Profile;
}

export default function ConfirmPaymentDialog({
  open,
  onOpenChange,
  booking,
  oppositeParty,
}: ConfirmPaymentDialogProps) {
  const [showPayment, setShowPayment] = useState(true);

  const handleConfirmAndPay = () => {
    setShowPayment(true);
  };

  const handleConfirmAndPayLater = () => {
    onOpenChange(false);
  };

  const fetchClientSecret = useCallback(async () => {
    return fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: booking.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, [booking.id]);

  const options: StripeEmbeddedCheckoutOptions = {
    fetchClientSecret,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Tutoring Session Payment
          </DialogTitle>
          <DialogDescription>
            Please review your booking details and complete the payment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row">
          {/* Booking Details Section (40%) */}
          <div className="w-full sm:w-[40%] p-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Session information</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Tutor: {oppositeParty.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Date: {format(new Date(booking.startTime), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    Time: {format(new Date(booking.startTime), "h:mm a")} -{" "}
                    {format(new Date(booking.endTime), "h:mm a")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form Section (60%) */}
          <div className="w-full sm:w-[60%] p-6 relative">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-4 top-4"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
            {showPayment ? (
              <div className="mt-4">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout className="h-[400px] overflow-hidden rounded-md border bg-background" />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
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
                <p className="text-sm text-muted-foreground text-center">
                  {`By selecting "Confirm & Pay Later", your lesson will be in "Waiting
                  for Payment" status. You'll have 12 hours before the lesson to
                  complete the payment.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

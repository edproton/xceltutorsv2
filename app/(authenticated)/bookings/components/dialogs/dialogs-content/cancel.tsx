import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { DateTime } from "luxon";
import { BookingDialogProps } from "../booking-dialog-props";

export function CancelDialogContent({
  booking,
  oppositeParty,
  onOpenChange,
}: BookingDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement cancellation logic here
    console.log("Cancelling booking:", booking.id, "Reason:", reason);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Cancel lesson
        </DialogTitle>
      </DialogHeader>
      <Card className="bg-muted mb-4">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">Lesson details</h2>
          <p className="text-sm text-muted-foreground">{oppositeParty.name}</p>
          <p className="text-sm text-muted-foreground">
            {booking.subject.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {DateTime.fromISO(booking.startTime).toFormat(
              "EEEE, MMMM d, yyyy 'at' h:mm a"
            )}
          </p>
        </CardContent>
      </Card>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for cancellation</Label>
          <Textarea
            id="reason"
            placeholder={`Let ${oppositeParty.name} know why you're cancelling this lesson`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
        <Button type="submit" variant="destructive">
          Cancel lesson
        </Button>
      </DialogFooter>
    </form>
  );
}

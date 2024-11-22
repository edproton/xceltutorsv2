import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { DateTime } from "luxon";
import { useBookingsStore } from "../store/bookingStore";

export default function CancelDialog() {
  const { selectedBooking, setOpenDialog } = useBookingsStore();
  const [reason, setReason] = React.useState("");

  if (!selectedBooking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the cancellation logic
    console.log("Cancelling lesson", { reason });
    setOpenDialog(null);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Cancel lesson
        </DialogTitle>
      </DialogHeader>
      <Card className="bg-muted mb-4">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">Lesson details</h2>
          <p className="text-sm text-muted-foreground">
            {selectedBooking.oppositeParty.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedBooking.subject.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {DateTime.fromISO(selectedBooking.startTime).toFormat(
              "EEEE, MMMM d, yyyy 'at' h:mm a"
            )}
          </p>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for cancellation</Label>
            <Textarea
              id="reason"
              placeholder={`Let ${selectedBooking.oppositeParty.name} know why you're cancelling this lesson`}
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
            onClick={() => setOpenDialog(null)}
          >
            Close
          </Button>
          <Button type="submit" variant="destructive">
            Cancel lesson
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

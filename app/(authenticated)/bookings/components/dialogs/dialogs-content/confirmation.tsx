import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DateTime } from "luxon";
import { BookingDialogProps } from "../booking-dialog-props";

export function ConfirmationDialogContent({
  booking,
  oppositeParty,
  onOpenChange,
}: BookingDialogProps) {
  const [message, setMessage] = useState(
    `Dear ${oppositeParty.name},

👋 This is a confirmation for our upcoming lesson on ${booking.subject.name} ${
      booking.subject.level.name
    } scheduled for ${DateTime.fromISO(booking.startTime).toFormat(
      "cccc, LLLL d, yyyy 'at' h:mm a"
    )}. 📅

Please confirm that this date and time work for you. If you need to make any changes or have any questions, please let me know as soon as possible. 🙏

I look forward to our session! Thank you! ✅`
  );

  const handleConfirmation = async () => {
    // Implement confirmation logic here
    console.log(
      "Sending confirmation for booking:",
      booking.id,
      "Message:",
      message
    );
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Send Confirmation</DialogTitle>
        <DialogDescription className="text-lg">
          Send a confirmation message for the scheduled lesson.
        </DialogDescription>
      </DialogHeader>
      <div className="flex-grow py-4 px-2 overflow-y-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-full min-h-[400px] text-base resize-none p-4 rounded-md"
          placeholder="Enter your confirmation message here..."
        />
      </div>
      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit" onClick={handleConfirmation} size="lg">
          Send Confirmation
        </Button>
      </DialogFooter>
    </>
  );
}

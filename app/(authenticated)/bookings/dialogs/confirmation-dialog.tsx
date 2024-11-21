import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile } from "@/lib/types";
import { DateTime } from "luxon";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: Profile;
  onSendConfirmation?: (message: string) => void;
  onCancel?: (reason: string) => void; // Add this line
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  booking,
  oppositeParty,
  onSendConfirmation,
}: ConfirmationDialogProps) {
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

  const handleSendConfirmation = () => {
    if (onSendConfirmation) {
      onSendConfirmation(message);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[90vh] flex flex-col">
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
          <Button type="submit" onClick={handleSendConfirmation} size="lg">
            Send Confirmation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

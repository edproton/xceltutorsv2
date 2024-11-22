import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DateTime } from "luxon";
import { useBookingsStore } from "../store/bookingStore";

export default function ResendConfirmationMessageDialog() {
  const { selectedBooking, setOpenDialog } = useBookingsStore();

  const [message, setMessage] = useState(() => {
    if (!selectedBooking) return "";

    return `Dear ${selectedBooking.oppositeParty.name},

👋 This is a confirmation for our upcoming lesson on ${
      selectedBooking.subject.name
    } ${selectedBooking.subject.level.name} scheduled for ${DateTime.fromISO(
      selectedBooking.startTime
    ).toFormat("cccc, LLLL d, yyyy 'at' h:mm a")}. 📅

Please confirm that this date and time work for you. If you need to make any changes or have any questions, please let me know as soon as possible. 🙏

I look forward to our session! Thank you! ✅`;
  });

  const handleSendConfirmation = () => {
    // Here you would typically send the confirmation message
    // For now, we'll just close the dialog
    setOpenDialog(null);
  };

  if (!selectedBooking) return null;

  return (
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
  );
}

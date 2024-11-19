"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { Booking } from "../types";

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onCancel: (reason: string) => void;
}

export default function CancelDialog({
  open,
  onOpenChange,
  booking,
  onCancel,
}: CancelDialogProps) {
  const [reason, setReason] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCancel(reason);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              {booking.studentName}
            </p>
            <p className="text-sm text-muted-foreground">{booking.subject}</p>
            <p className="text-sm text-muted-foreground">
              {booking.dateTime.toFormat("EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
          </CardContent>
        </Card>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation</Label>
              <Textarea
                id="reason"
                placeholder={`Let ${booking.studentName} know why you're cancelling this lesson`}
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
      </DialogContent>
    </Dialog>
  );
}

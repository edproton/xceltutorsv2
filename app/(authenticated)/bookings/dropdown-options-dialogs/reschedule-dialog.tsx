import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock } from "lucide-react";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingsStore } from "../store/bookingStore";

export default function RescheduleDialog() {
  const { selectedBooking, setOpenDialog } = useBookingsStore();

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState("");
  const [rescheduleType, setRescheduleType] = React.useState("single");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (selectedBooking) {
      const bookingDateTime = DateTime.fromISO(selectedBooking.startTime);
      setDate(bookingDateTime.toJSDate());
      setTime(bookingDateTime.toFormat("HH:mm"));
    }
  }, [selectedBooking]);

  if (!selectedBooking) return null;

  const bookingDateTime = DateTime.fromISO(selectedBooking.startTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const newDateTime = DateTime.fromJSDate(date).set({
      hour: parseInt(time.split(":")[0]),
      minute: parseInt(time.split(":")[1]),
    });
    console.log("Rescheduling lesson", {
      newDateTime: newDateTime.toISO(),
      rescheduleType,
      message,
    });
    setOpenDialog(null);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          Reschedule booking
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-2">Current booking</h2>
            <p className="text-sm text-muted-foreground">
              {selectedBooking.oppositeParty.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {bookingDateTime.toFormat("EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            Suggest a new time to {selectedBooking.oppositeParty.name}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    aria-label="Select date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? DateTime.fromJSDate(date).toFormat("DDD")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < DateTime.now().startOf("day").toJSDate()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (UK time)</Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <RadioGroup
          value={rescheduleType}
          onValueChange={setRescheduleType}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
            <RadioGroupItem value="single" id="single" />
            <Label
              htmlFor="single"
              className="font-medium cursor-pointer flex-grow"
            >
              Only reschedule this lesson
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
            <RadioGroupItem value="all" id="all" />
            <Label
              htmlFor="all"
              className="font-medium cursor-pointer flex-grow"
            >
              Reschedule all lessons from{" "}
              {bookingDateTime.toFormat("DDD").toUpperCase()} onwards
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="message">
            Send {selectedBooking.oppositeParty.name} a message (optional)
          </Label>
          <Textarea
            id="message"
            placeholder={`Let ${selectedBooking.oppositeParty.name} know why you're proposing a new time`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialog(null)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Request new time
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

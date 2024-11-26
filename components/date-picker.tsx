"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export default function DatePicker({
  onDateSelect,
  selectedDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setOpen(false);
    onDateSelect(date);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start px-3 py-6 text-left font-normal",
              "border-2 transition-colors duration-200",
              "hover:bg-muted/50",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5" />
            {selectedDate
              ? format(selectedDate, "EEE dd MMM ''yy")
              : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

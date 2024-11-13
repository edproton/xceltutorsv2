"use client";

import * as React from "react";
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
  onDateSelect?: (date: Date | undefined) => void;
}

export default function Component({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setOpen(false);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
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
              "w-full justify-start border-2 px-3 py-6 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5" />
            {date ? format(date, "EEE dd MMM ''yy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            defaultMonth={new Date()}
            fromDate={new Date()}
            modifiers={{
              today: new Date(),
            }}
            modifiersStyles={{
              today: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
              selected: {
                backgroundColor: "hsl(var(--primary)/0.1)",
                color: "hsl(var(--primary))",
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

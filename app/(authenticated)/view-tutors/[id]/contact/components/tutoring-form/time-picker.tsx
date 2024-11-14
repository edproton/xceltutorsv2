"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  onTimeSelect: (time: string | undefined) => void;
  disabled?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
}

// Move periods array outside of the component
const periods = [
  { label: "12am - 5am", value: "12am-5am", start: 0, end: 5 },
  { label: "6am - 11am", value: "6am-11am", start: 6, end: 11 },
  { label: "12pm - 5pm", value: "12pm-5pm", start: 12, end: 17 },
  { label: "6pm - 11pm", value: "6pm-11pm", start: 18, end: 23 },
];

export default function TimePicker({
  onTimeSelect,
  disabled = false,
  open,
  setOpen,
  value,
}: TimePickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12am-5am");
  const [selectedTime, setSelectedTime] = useState<string | undefined>(value);

  const generateTimeSlots = useCallback((start: number, end: number) => {
    const slots = [];
    for (let hour = start; hour <= end; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  }, []);

  const timeSlots = useMemo(() => {
    const period = periods.find((p) => p.value === selectedPeriod);
    return period ? generateTimeSlots(period.start, period.end) : [];
  }, [selectedPeriod, generateTimeSlots]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setOpen(false);
    onTimeSelect(time);
  };

  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  useEffect(() => {
    if (selectedTime) {
      const hour = parseInt(selectedTime.split(":")[0], 10);
      const period = periods.find((p) => hour >= p.start && hour <= p.end);
      if (period) {
        setSelectedPeriod(period.value);
      }
    }
  }, [selectedTime]);

  return (
    <div className="space-y-2">
      <Label htmlFor="time">Time (UK time)</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="time"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-start px-3 py-6 text-left font-normal",
              "border-2 transition-colors duration-200",
              "hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            {selectedTime ? (
              <span className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
                  {selectedTime}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select time</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-3" align="start">
          <Tabs
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-muted p-1 rounded-md">
              {periods.map((period) => (
                <TabsTrigger
                  key={period.value}
                  value={period.value}
                  className={cn(
                    "transition-all duration-200 ease-in-out",
                    "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  )}
                >
                  <span className="font-normal">
                    {period.label.split(" - ")[0]}
                  </span>
                  <span className="text-muted-foreground mx-1">-</span>
                  <span className="font-normal">
                    {period.label.split(" - ")[1]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="grid grid-cols-4 gap-2 pt-4">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn(
                    "font-normal transition-all duration-200 ease-in-out",
                    "hover:bg-muted/50",
                    selectedTime === time &&
                      "bg-primary/10 text-primary border-primary"
                  )}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}

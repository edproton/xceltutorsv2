"use client";

import { useState, useEffect, useMemo } from "react";
import { DateTime } from "luxon";
import { Plus, Trash2, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRange, Availability } from "@/lib/timezone";

interface DayTimeRange {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeRanges: DayTimeRange[];
}

type WeekSchedule = Record<string, DaySchedule>;

export default function Component() {
  const [schedule, setSchedule] = useState<WeekSchedule>({});
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [generatedSlots, setGeneratedSlots] = useState<TimeRange[]>([]);
  const [scheduleTimezone, setScheduleTimezone] = useState("Europe/London");
  const [searchQuery, setSearchQuery] = useState("");

  const timezones = useMemo(() => Intl.supportedValuesOf("timeZone"), []);

  const filteredTimezones = useMemo(() => {
    return timezones.filter((tz) =>
      tz.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [timezones, searchQuery]);

  useEffect(() => {
    const now = DateTime.now().setZone("UTC").startOf("week");
    const dynamicSchedule: WeekSchedule = {};

    for (let i = 0; i < 7; i++) {
      const day = now.plus({ days: i }).setZone(scheduleTimezone);
      const dayName = day.toFormat("cccc");

      dynamicSchedule[dayName] = {
        enabled: false,
        timeRanges: [],
      };
    }

    setSchedule(dynamicSchedule);
  }, [scheduleTimezone]);

  const addTimeRange = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: [...prev[day].timeRanges, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeTimeRange = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeRange = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeRanges: prev[day].timeRanges.map((range, i) =>
          i === index ? { ...range, [field]: value } : range
        ),
      },
    }));
  };

  const toggleDay = (day: string, enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        enabled,
        timeRanges: enabled ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }));
  };

  const generateAvailability = (): Availability => {
    const timeRanges: TimeRange[] = [];
    const now = DateTime.now().setZone(scheduleTimezone);
    const startOfWeek = now.startOf("week");

    Object.entries(schedule).forEach(
      ([, { enabled, timeRanges: ranges }], dayIndex) => {
        if (enabled && ranges.length > 0) {
          ranges.forEach(({ start, end }) => {
            const [startHour, startMinute] = start.split(":").map(Number);
            const [endHour, endMinute] = end.split(":").map(Number);

            const rangeStart = startOfWeek.plus({ days: dayIndex }).set({
              hour: startHour,
              minute: startMinute,
              second: 0,
              millisecond: 0,
            });

            const rangeEnd = startOfWeek.plus({ days: dayIndex }).set({
              hour: endHour,
              minute: endMinute,
              second: 0,
              millisecond: 0,
            });

            timeRanges.push(new TimeRange(rangeStart, rangeEnd));
          });
        }
      }
    );

    return new Availability(timeRanges).toUtc();
  };

  const generateTimeSlots = () => {
    if (!selectedDate) return;

    const availability = generateAvailability();
    const localizedAvailability = availability.localize(selectedTimezone);

    const slots: TimeRange[] = [];
    localizedAvailability.timeRanges.forEach((range) => {
      const dateTimeSlots = range.generateHourlySlotsForDate(
        DateTime.fromJSDate(selectedDate).setZone(selectedTimezone),
        selectedTimezone
      );
      slots.push(...dateTimeSlots);
    });

    setGeneratedSlots(slots);
  };

  return (
    <div className="w-full max-w-3xl space-y-8 p-4 bg-background rounded-lg border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly Schedule</h2>
          <Select value={scheduleTimezone} onValueChange={setScheduleTimezone}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center px-3 pb-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search timezone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-full"
                />
              </div>
              <ScrollArea className="h-[200px]">
                {filteredTimezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        {Object.entries(schedule).map(([day, { enabled, timeRanges }]) => (
          <div key={day} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => toggleDay(day, checked)}
                />
                <span className="text-sm font-medium">{day}</span>
              </div>
              {enabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addTimeRange(day)}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {enabled &&
              timeRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={range.start}
                    onChange={(e) =>
                      updateTimeRange(day, index, "start", e.target.value)
                    }
                    className="bg-background border rounded px-2 py-1 text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="time"
                    value={range.end}
                    onChange={(e) =>
                      updateTimeRange(day, index, "end", e.target.value)
                    }
                    className="bg-background border rounded px-2 py-1 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeRange(day, index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Generate Time Slots</h2>
        <div className="flex space-x-4">
          <div className="w-1/3">
            <Select
              value={selectedTimezone}
              onValueChange={setSelectedTimezone}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <div className="flex items-center px-3 pb-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search timezone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-full"
                  />
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredTimezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="w-1/3">
            <Button onClick={generateTimeSlots}>Generate Slots</Button>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-md font-medium">Generated Time Slots:</h3>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {generatedSlots.map((slot, index) => (
              <div key={index} className="text-sm">
                {slot.startTime.toFormat("HH:mm")} -{" "}
                {slot.endTime.toFormat("HH:mm")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

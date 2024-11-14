"use client";

import {
  Control,
  UseFormSetValue,
  UseFormWatch,
  Controller,
  FieldErrors,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import TimePicker from "./time-picker";
import DatePicker from "./date-picker";
import { TutoringFormData } from "./schema";
import { useState } from "react";

interface MeetingSchedulerProps {
  control: Control<TutoringFormData>;
  setValue: UseFormSetValue<TutoringFormData>;
  watch: UseFormWatch<TutoringFormData>;
  errors: FieldErrors<TutoringFormData>;
}

export default function MeetingScheduler({
  control,
  setValue,
  watch,
  errors,
}: MeetingSchedulerProps) {
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const watchedFields = watch();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("meetingDate", date);
      setValue("meetingTime", "");
      setTimePickerOpen(true);
    }
  };

  const handleTimeSelect = (time: string | undefined) => {
    if (time) {
      setValue("meetingTime", time);
    }
  };

  return (
    <div className="space-y-4">
      <Label>
        Suggest a day and time for the video meeting{" "}
        <span className="text-red-500">*</span>
      </Label>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Controller
            name="meetingDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                onDateSelect={(date) => {
                  if (date) {
                    field.onChange(date);
                    handleDateSelect(date);
                  }
                }}
                selectedDate={field.value}
              />
            )}
          />
          {errors.meetingDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.meetingDate.message}
            </p>
          )}
        </div>
        <div>
          <Controller
            name="meetingTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                onTimeSelect={(time) => {
                  if (time) {
                    field.onChange(time);
                    handleTimeSelect(time);
                  }
                }}
                disabled={!watchedFields.meetingDate}
                open={timePickerOpen}
                setOpen={setTimePickerOpen}
                value={field.value}
              />
            )}
          />
          {errors.meetingTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.meetingTime.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

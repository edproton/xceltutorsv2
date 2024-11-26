"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDialog } from "@/contexts/dialog-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";
import TimePicker from "@/components/time-picker";

interface FormData {
  meetingDate: Date | undefined;
  meetingTime: string;
}

export function RescheduleDialog() {
  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      meetingDate: undefined,
      meetingTime: "",
    },
  });

  const watchedFields = watch();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    if (data.meetingDate && data.meetingTime) {
      toast({
        title: "Reschedule request sent",
        description: `Requested for ${format(
          data.meetingDate,
          "MMMM d, yyyy"
        )} at ${data.meetingTime}`,
      });
      closeDialog();
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Reschedule Lesson</DialogTitle>
        <DialogDescription>
          Choose a new date and time for your lesson.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Label>
          Suggest a day and time for the video meeting{" "}
          <span className="text-red-500">*</span>
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Controller
              name="meetingDate"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  onDateSelect={(date) => {
                    field.onChange(date);
                    setTimePickerOpen(true);
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
              rules={{ required: "Time is required" }}
              render={({ field }) => (
                <TimePicker
                  onTimeSelect={(time) => field.onChange(time)}
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
        <Button type="submit" className="w-full">
          Submit Reschedule Request
        </Button>
      </form>
    </div>
  );
}

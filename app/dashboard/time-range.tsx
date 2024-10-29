import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type TimeSlot = {
  start: string;
  end: string;
};

type TimeRangeProps = {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  minStartTime: string;
  maxEndTime: string;
  disabled?: boolean;
  error?: string;
  index: number;
  overlapsWithOtherSlots?: boolean;
  allSlots: TimeSlot[];
};

const TIME_INTERVAL = 30; // minutes
const MIN_DURATION = 60; // minutes
const LATEST_START_TIME = "23:00";
const FINAL_END_TIME = "23:59";

export function TimeRange({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  minStartTime,
  maxEndTime,
  disabled = false,
  error,
  index,
  allSlots,
}: TimeRangeProps) {
  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(2000, 0, 1, hours, minutes);
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const addMinutes = (time: string, minutes: number): string => {
    const date = parseTime(time);
    date.setMinutes(date.getMinutes() + minutes);
    return formatTime(date);
  };

  const getTimeDifferenceInMinutes = (start: string, end: string): number => {
    const startDate = parseTime(start);
    const endDate = parseTime(end);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  };

  const checkOverlap = (slot: TimeSlot, index: number): boolean => {
    return allSlots.some((otherSlot, i) => {
      if (i === index) return false;
      const slotStart = parseTime(slot.start);
      const slotEnd = parseTime(slot.end);
      const otherStart = parseTime(otherSlot.start);
      const otherEnd = parseTime(otherSlot.end);

      return (
        (slotStart >= otherStart && slotStart < otherEnd) ||
        (slotEnd > otherStart && slotEnd <= otherEnd) ||
        (slotStart <= otherStart && slotEnd >= otherEnd)
      );
    });
  };

  const generateTimeOptions = (
    start: string,
    end: string,
    interval: number
  ) => {
    const options: { value: string; disabled: boolean; tooltip?: string }[] =
      [];
    const current = parseTime(start);
    const endDate = parseTime(end);

    while (current <= endDate) {
      const timeStr = formatTime(current);
      const isOverlapping = checkOverlap(
        { start: timeStr, end: addMinutes(timeStr, MIN_DURATION) },
        index
      );

      options.push({
        value: timeStr,
        disabled: isOverlapping,
        tooltip: isOverlapping ? "Overlaps with another time slot" : undefined,
      });

      current.setMinutes(current.getMinutes() + interval);
    }

    if (
      end === FINAL_END_TIME &&
      options[options.length - 1].value !== FINAL_END_TIME
    ) {
      options.push({ value: FINAL_END_TIME, disabled: false });
    }

    return options;
  };

  const getValidStartOptions = () => {
    const maxStartTime =
      endTime === FINAL_END_TIME
        ? LATEST_START_TIME
        : addMinutes(endTime, -MIN_DURATION);
    return generateTimeOptions(minStartTime, maxStartTime, TIME_INTERVAL);
  };

  const getValidEndOptions = () => {
    if (startTime === LATEST_START_TIME) {
      return [{ value: FINAL_END_TIME, disabled: false }];
    }

    const minEndTime = addMinutes(startTime, MIN_DURATION);
    let endOptions = generateTimeOptions(minEndTime, maxEndTime, TIME_INTERVAL);

    if (startTime >= "22:30") {
      endOptions = endOptions.filter(
        (option) => option.value === "23:30" || option.value === FINAL_END_TIME
      );
    }

    return endOptions;
  };

  const startOptions = getValidStartOptions();
  const endOptions = getValidEndOptions();

  const getDurationText = (): string => {
    const minutes = getTimeDifferenceInMinutes(startTime, endTime);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return remainingMinutes === 0
      ? `${hours}h`
      : `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Select
          onValueChange={onStartTimeChange}
          value={startTime}
          disabled={disabled}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Start Time" />
          </SelectTrigger>
          <SelectContent>
            {startOptions.map((option) => (
              <TooltipProvider key={option.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem
                      value={option.value}
                      disabled={option.disabled}
                      className={option.disabled ? "opacity-50" : ""}
                    >
                      {option.value}
                    </SelectItem>
                  </TooltipTrigger>
                  {option.tooltip && (
                    <TooltipContent>
                      <p>{option.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </SelectContent>
        </Select>
        <span>to</span>
        <Select
          onValueChange={onEndTimeChange}
          value={endTime}
          disabled={disabled}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="End Time" />
          </SelectTrigger>
          <SelectContent>
            {endOptions.map((option) => (
              <TooltipProvider key={option.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem
                      value={option.value}
                      disabled={option.disabled}
                      className={option.disabled ? "opacity-50" : ""}
                    >
                      {option.value}
                    </SelectItem>
                  </TooltipTrigger>
                  {option.tooltip && (
                    <TooltipContent>
                      <p>{option.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </SelectContent>
        </Select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-gray-500">
                <Info className="h-4 w-4 mr-1" />
                {getDurationText()}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Time slot duration</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

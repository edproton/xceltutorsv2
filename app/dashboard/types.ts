// types.ts
import { RecordModel } from "pocketbase";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export interface AvailabilityRecord extends RecordModel {
  weekday: Weekday;
  timerange_start: string;
  timerange_end: string;
  tutor: string;
}

export interface GroupedAvailability {
  [weekday: string]: {
    timerange_start: string;
    timerange_end: string;
  }[];
}

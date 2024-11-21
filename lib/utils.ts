import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToLondonTime(utcTime: string): string {
  return DateTime.fromISO(utcTime, { zone: "utc" })
    .setZone("Europe/London")
    .toISO()!;
}

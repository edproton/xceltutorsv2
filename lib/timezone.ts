// utils/timezone.ts
import { DateTime } from "luxon";

export const ISO_TO_TIMEZONE: Record<number, string> = {
  1: "America/New_York", // USA
  7: "Asia/Bangkok", // Thailand
  20: "Africa/Cairo", // Egypt
  27: "Africa/Johannesburg", // South Africa
  30: "Europe/Athens", // Greece
  31: "Europe/Amsterdam", // Netherlands
  32: "Europe/Brussels", // Belgium
  33: "Europe/Paris", // France
  34: "Europe/Madrid", // Spain
  36: "Europe/Budapest", // Hungary
  39: "Europe/Rome", // Italy
  40: "Europe/Bucharest", // Romania
  41: "Europe/Zurich", // Switzerland
  43: "Europe/Vienna", // Austria
  44: "Europe/London", // UK
  45: "Europe/Copenhagen", // Denmark
  46: "Europe/Stockholm", // Sweden
  47: "Europe/Oslo", // Norway
  48: "Europe/Warsaw", // Poland
  49: "Europe/Berlin", // Germany
  51: "America/Lima", // Peru
  52: "America/Mexico_City", // Mexico
  54: "America/Argentina/Buenos_Aires", // Argentina
  55: "America/Sao_Paulo", // Brazil
  56: "America/Santiago", // Chile
  57: "America/Bogota", // Colombia
  61: "Australia/Sydney", // Australia
  64: "Pacific/Auckland", // New Zealand
  81: "Asia/Tokyo", // Japan
  82: "Asia/Seoul", // South Korea
  84: "Asia/Ho_Chi_Minh", // Vietnam
  86: "Asia/Shanghai", // China
  91: "Asia/Kolkata", // India
  92: "Asia/Karachi", // Pakistan
  94: "Asia/Colombo", // Sri Lanka
  95: "Asia/Yangon", // Myanmar
  98: "Asia/Tehran", // Iran
  156: "Asia/Shanghai", // China (alternate code)
  166: "Asia/Jakarta", // Indonesia
  351: "Europe/Lisbon", // Portugal
  352: "Europe/Luxembourg", // Luxembourg
  353: "Europe/Dublin", // Ireland
  358: "Europe/Helsinki", // Finland
  420: "Europe/Prague", // Czech Republic
  421: "Europe/Bratislava", // Slovakia
};

export function convertToUTC(
  time: string,
  date: string,
  countryIsoNum: number
): string {
  const timezone = ISO_TO_TIMEZONE[countryIsoNum] || "UTC";
  const localDateTime = DateTime.fromFormat(
    `${date} ${time}`,
    "yyyy-MM-dd HH:mm",
    {
      zone: timezone,
    }
  );
  return localDateTime.toUTC().toFormat("HH:mm");
}

export function convertFromUTC(
  time: string,
  date: string,
  countryIsoNum: number
): string {
  const timezone = ISO_TO_TIMEZONE[countryIsoNum] || "UTC";
  const utcDateTime = DateTime.fromFormat(
    `${date} ${time}`,
    "yyyy-MM-dd HH:mm",
    {
      zone: "UTC",
    }
  );
  return utcDateTime.setZone(timezone).toFormat("HH:mm");
}

export function getTimezoneLabel(countryIsoNum: number): string {
  const timezone = ISO_TO_TIMEZONE[countryIsoNum] || "UTC";
  const now = DateTime.now().setZone(timezone);
  const offset = now.toFormat("Z");
  const abbr = now.toFormat("ZZZZ");
  return `${timezone} (${abbr}, UTC${offset})`;
}

import { DateTime } from "luxon";

export class TimeRange {
  startTime: DateTime;
  endTime: DateTime;

  constructor(startTime: DateTime, endTime: DateTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  localize(targetZone: string): TimeRange {
    return new TimeRange(
      this.startTime.setZone(targetZone),
      this.endTime.setZone(targetZone)
    );
  }

  generateHourlySlotsForDate(
    requestedDate: DateTime,
    targetZone: string
  ): TimeRange[] {
    const localizedStartTime = this.startTime.setZone(targetZone);
    const localizedEndTime = this.endTime.setZone(targetZone);

    const dayStart = DateTime.fromObject(
      {
        year: requestedDate.year,
        month: requestedDate.month,
        day: requestedDate.day,
        hour: 0,
        minute: 0,
        second: 0,
      },
      { zone: targetZone }
    );

    const dayEnd = dayStart.plus({ days: 1 });

    const hourlySlots: TimeRange[] = [];

    let currentStart =
      localizedStartTime > dayStart ? localizedStartTime : dayStart;
    const currentEnd = localizedEndTime < dayEnd ? localizedEndTime : dayEnd;

    while (currentStart < currentEnd) {
      const nextHour = currentStart.plus({ hours: 1 });
      let slotEnd = nextHour <= currentEnd ? nextHour : currentEnd;

      // Check if the slot end time crosses into the next day at midnight
      if (
        slotEnd.hour === 0 &&
        slotEnd.minute === 0 &&
        slotEnd.day !== currentStart.day
      ) {
        slotEnd = slotEnd.minus({ minutes: 1 });
        hourlySlots.push(new TimeRange(currentStart, slotEnd));
        break;
      }

      hourlySlots.push(new TimeRange(currentStart, slotEnd));
      currentStart = slotEnd;
    }

    return hourlySlots;
  }

  toString(): string {
    return `[${
      this.startTime.weekdayLong
    }] Start: ${this.startTime.toISO()}, [${
      this.endTime.weekdayLong
    }] End: ${this.endTime.toISO()}`;
  }
}

export class Availability {
  timeRanges: TimeRange[] = [];

  constructor(timeRanges: TimeRange[] = []) {
    this.timeRanges = timeRanges;
  }

  localize(targetZone: string): Availability {
    return new Availability(
      this.timeRanges.map((tr) => tr.localize(targetZone))
    );
  }

  toUtc(): Availability {
    return this.localize("UTC");
  }
}

// Example usage:
const startTime = DateTime.utc(2024, 11, 4, 9, 0); // Replace with actual DateTime
const endTime = DateTime.utc(2024, 11, 4, 18, 0); // Replace with actual DateTime
const timeRange = new TimeRange(startTime, endTime);

const availability = new Availability([timeRange]);
const localizedAvailability = availability.localize("Europe/Lisbon");
console.log(localizedAvailability);

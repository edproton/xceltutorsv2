import { DateTime, Interval } from "luxon";

// Base Types
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type UserType = "tutor" | "student";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type ConflictReason =
  | "direct_overlap"
  | "buffer_violation"
  | "outside_availability"
  | "dst_transition";

export type DstTransitionType = "start" | "end";

// Time-related interfaces
export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

// Make DayOfWeek required keys with optional TimeRange arrays
export type DailyAvailability = {
  [K in DayOfWeek]: TimeRange[] | undefined;
};

// User-related interfaces
export interface User {
  id: string;
  name: string;
  countryIsoNum: number;
  type: UserType;
  availability?: DailyAvailability;
}

export interface DstTransitionInfo {
  type: DstTransitionType;
  changeAmount: number; // in minutes
  warningMessage: string;
}

// Time slot interfaces
export interface TimeSlot {
  // Base time information (always in student's timezone)
  startTime: DateTime;
  endTime: DateTime;

  // Original tutor times (for reference)
  tutorStartTime: DateTime;
  tutorEndTime: DateTime;

  // DST metadata for UI
  dstInfo?: DstTransitionInfo;

  // Availability status
  isAvailable: boolean;
  conflictReason?: ConflictReason;
}

// Booking-related interfaces
export interface BookingRequest {
  tutorId: string;
  studentId: string;
  startTime: string; // ISO string in student's timezone
  endTime: string; // ISO string in student's timezone
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  status: BookingStatus;
  createdAt: string; // ISO string

  // Times in different formats for easy access
  tutorStartTime: string; // ISO string in tutor's timezone
  tutorEndTime: string; // ISO string in tutor's timezone
  studentStartTime: string; // ISO string in student's timezone
  studentEndTime: string; // ISO string in student's timezone
}

export interface BookingConflict {
  hasConflict: boolean;
  reason?: ConflictReason;
  conflictingBooking?: Booking;
}

export interface BookingDisplayInfo {
  localStartTime: DateTime;
  localEndTime: DateTime;
  dstInfo?: DstTransitionInfo;
}

// Service Configuration
export interface AvailabilityServiceConfig {
  bufferMinutes: number;
  defaultSlotDuration: number; // in minutes
  maxFutureBookingDays: number;
  minAdvanceBookingHours: number;
}

// Helper function to ensure DateTime to ISO string never returns null
const toISOString = (dt: DateTime): string => {
  const iso = dt.toISO();
  if (!iso) throw new Error("Failed to convert DateTime to ISO string");
  return iso;
};

// Helper function to get day of week
const getDayOfWeek = (dt: DateTime): DayOfWeek => {
  const weekday = dt.weekdayLong?.toLowerCase();
  if (
    !weekday ||
    !(
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ] as const
    ).includes(weekday as DayOfWeek)
  ) {
    throw new Error("Invalid weekday");
  }
  return weekday as DayOfWeek;
};

// Main Service Class
export class AvailabilityService {
  private bookings: Booking[] = [];
  private readonly config: AvailabilityServiceConfig;

  constructor(config?: Partial<AvailabilityServiceConfig>) {
    this.config = {
      bufferMinutes: 10,
      defaultSlotDuration: 60,
      maxFutureBookingDays: 90,
      minAdvanceBookingHours: 24,
      ...config,
    };
  }

  public getCountryZone(countryIsoNum: number): string {
    const zoneMap: Record<number, string> = {
      156: "Asia/Shanghai", // China
      620: "Europe/Lisbon", // Portugal
      840: "America/New_York", // USA Eastern (UTC-4/-5)
    };

    const zone = zoneMap[countryIsoNum];
    if (!zone) {
      throw new Error(`Unsupported country ISO: ${countryIsoNum}`);
    }

    return zone;
  }

  private getDstWarningMessage(
    studentTime: DateTime,
    changeAmount: number,
    type: DstTransitionType
  ): string {
    const formattedTime = studentTime.toLocaleString(DateTime.TIME_SIMPLE);
    const changeHours = Math.abs(changeAmount) / 60;

    if (type === "start") {
      return `Due to Daylight Saving Time starting, the clock will move forward ${changeHours} hour(s) at ${formattedTime}`;
    }
    return `Due to Daylight Saving Time ending, the clock will move back ${changeHours} hour(s) at ${formattedTime}`;
  }

  private validateBookingTime(startTime: DateTime, endTime: DateTime): void {
    const now = DateTime.now();

    // Check minimum advance booking time
    if (startTime < now.plus({ hours: this.config.minAdvanceBookingHours })) {
      throw new Error(
        `Booking must be at least ${this.config.minAdvanceBookingHours} hours in advance`
      );
    }

    // Check maximum future booking time
    if (startTime > now.plus({ days: this.config.maxFutureBookingDays })) {
      throw new Error(
        `Cannot book more than ${this.config.maxFutureBookingDays} days in advance`
      );
    }

    // Check if end time is after start time
    if (endTime <= startTime) {
      throw new Error("End time must be after start time");
    }
  }

  private checkBookingConflicts(
    tutorId: string,
    startTime: DateTime,
    endTime: DateTime
  ): BookingConflict {
    const proposedInterval = Interval.fromDateTimes(
      startTime.toUTC(),
      endTime.toUTC()
    );

    const activeBookings = this.bookings.filter(
      (booking) => booking.tutorId === tutorId && booking.status !== "cancelled"
    );

    for (const booking of activeBookings) {
      const existingInterval = Interval.fromDateTimes(
        DateTime.fromISO(booking.tutorStartTime),
        DateTime.fromISO(booking.tutorEndTime)
      );

      // Check direct overlap
      if (proposedInterval.overlaps(existingInterval)) {
        return {
          hasConflict: true,
          reason: "direct_overlap",
          conflictingBooking: booking,
        };
      }

      // Check buffer violations
      const bufferBefore = Interval.fromDateTimes(
        DateTime.fromISO(booking.tutorStartTime).minus({
          minutes: this.config.bufferMinutes,
        }),
        DateTime.fromISO(booking.tutorStartTime)
      );

      const bufferAfter = Interval.fromDateTimes(
        DateTime.fromISO(booking.tutorEndTime),
        DateTime.fromISO(booking.tutorEndTime).plus({
          minutes: this.config.bufferMinutes,
        })
      );

      if (
        proposedInterval.overlaps(bufferBefore) ||
        proposedInterval.overlaps(bufferAfter)
      ) {
        return {
          hasConflict: true,
          reason: "buffer_violation",
          conflictingBooking: booking,
        };
      }
    }

    return { hasConflict: false };
  }
  public generateTimeSlots(
    tutor: User,
    student: User,
    date: DateTime,
    duration: number = this.config.defaultSlotDuration
  ): TimeSlot[] {
    const tutorZone = this.getCountryZone(tutor.countryIsoNum);
    const studentZone = this.getCountryZone(student.countryIsoNum);
    const slots: TimeSlot[] = [];

    const tutorDate = date.setZone(tutorZone);
    const dayOfWeek = getDayOfWeek(tutorDate);

    const dayAvailability = tutor.availability?.[dayOfWeek];
    if (!dayAvailability) {
      return slots;
    }

    for (const range of dayAvailability) {
      let slotStart = tutorDate.set({
        hour: parseInt(range.start.split(":")[0], 10),
        minute: parseInt(range.start.split(":")[1], 10),
      });

      const rangeEnd = tutorDate.set({
        hour: parseInt(range.end.split(":")[0], 10),
        minute: parseInt(range.end.split(":")[1], 10),
      });

      while (slotStart < rangeEnd) {
        const slotEnd = slotStart.plus({ minutes: duration });
        if (slotEnd > rangeEnd) break;

        const studentSlotStart = slotStart.setZone(studentZone);
        const studentSlotEnd = slotEnd.setZone(studentZone);

        let dstInfo: DstTransitionInfo | undefined;

        // Check for multiple DST transitions within the slot
        const slotInterval = Interval.fromDateTimes(
          studentSlotStart,
          studentSlotEnd
        );

        const dstTransitions = this.getDSTTransitions(slotInterval);
        if (dstTransitions.length > 0) {
          // Handle multiple DST transitions
          dstInfo = {
            type: dstTransitions[0].type,
            changeAmount: dstTransitions[0].changeAmount,
            warningMessage: dstTransitions
              .map((dt) => dt.warningMessage)
              .join("; "),
          };
        }

        const conflict = this.checkBookingConflicts(
          tutor.id,
          slotStart,
          slotEnd
        );

        slots.push({
          startTime: studentSlotStart,
          endTime: studentSlotEnd,
          tutorStartTime: slotStart,
          tutorEndTime: slotEnd,
          dstInfo,
          isAvailable: !conflict.hasConflict,
          conflictReason: conflict.reason,
        });

        slotStart = slotEnd;
      }
    }

    return slots;
  }

  private getDSTTransitions(interval: Interval): DstTransitionInfo[] {
    const transitions: DstTransitionInfo[] = [];
    let dt = interval.start!;
    const end = interval.end!;

    while (dt < end) {
      const next = dt.plus({ minutes: 30 });
      if (dt.offset !== next.offset) {
        const changeAmount = next.offset - dt.offset;
        const type: DstTransitionType = changeAmount > 0 ? "start" : "end";
        transitions.push({
          type,
          changeAmount: Math.abs(changeAmount * 60),
          warningMessage: this.getDstWarningMessage(
            next,
            changeAmount * 60,
            type
          ),
        });
      }
      dt = next;
    }

    return transitions;
  }

  public async saveBooking(request: BookingRequest): Promise<Booking> {
    const studentStart = DateTime.fromISO(request.startTime);
    const studentEnd = DateTime.fromISO(request.endTime);

    // Validate booking times
    this.validateBookingTime(studentStart, studentEnd);

    // Check conflicts
    const conflict = this.checkBookingConflicts(
      request.tutorId,
      studentStart,
      studentEnd
    );

    if (conflict.hasConflict) {
      throw new Error(`Booking conflict: ${conflict.reason}`);
    }

    const booking: Booking = {
      id: crypto.randomUUID(),
      tutorId: request.tutorId,
      studentId: request.studentId,
      status: "pending",
      createdAt: toISOString(DateTime.now().toUTC()),
      tutorStartTime: toISOString(studentStart.toUTC()),
      tutorEndTime: toISOString(studentEnd.toUTC()),
      studentStartTime: request.startTime,
      studentEndTime: request.endTime,
    };

    this.bookings.push(booking);
    return booking;
  }

  public async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus
  ): Promise<Booking> {
    const booking = this.bookings.find((b) => b.id === bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = newStatus;
    return booking;
  }

  public getBookingDisplayInfo(
    booking: Booking,
    userCountryIsoNum: number
  ): BookingDisplayInfo {
    const userZone = this.getCountryZone(userCountryIsoNum);

    const localStartTime = DateTime.fromISO(booking.studentStartTime).setZone(
      userZone
    );
    const localEndTime = DateTime.fromISO(booking.studentEndTime).setZone(
      userZone
    );

    let dstInfo: DstTransitionInfo | undefined;

    if (localStartTime.isInDST !== localEndTime.isInDST) {
      const changeAmount = localEndTime.offset - localStartTime.offset;
      const transitionType: DstTransitionType =
        changeAmount > 0 ? "start" : "end";
      const dstTransitionTime = localStartTime.isInDST
        ? localEndTime
        : localStartTime;

      dstInfo = {
        type: transitionType,
        changeAmount: Math.abs(changeAmount),
        warningMessage: this.getDstWarningMessage(
          dstTransitionTime,
          changeAmount,
          transitionType
        ),
      };
    }

    return {
      localStartTime,
      localEndTime,
      dstInfo,
    };
  }
}

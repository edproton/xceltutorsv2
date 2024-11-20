import { TutorMetadata } from "@/lib/database/types";

export interface Service {
  subject: string;
  level: string;
  price: string;
}

export interface Availability {
  weekday: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

interface UiHelper {
  hasAlreadyHadDemoBooking: boolean;
  multiplePrices?: {
    minPrice: number;
    maxPrice: number;
  };
}

export interface TutorWithAvailabilityAndServices {
  id: string;
  name: string;
  avatar: string;
  metadata: TutorMetadata;
  services: Service[];
  availabilities: Availability[];
  uiHelper: UiHelper;
}

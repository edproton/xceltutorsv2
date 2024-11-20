interface Bio {
  full: string;
  short: string;
  session: string;
}

export interface Metadata {
  bio: Bio;
  tags: string[];
  degree: string;
  grades: { grade: string; level: string; subject: string }[];
  reviews: number;
  university: string;
  completedLessons: number;
  trustedBySchools: boolean;
}

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
  metadata: Metadata;
  services: Service[];
  availabilities: Availability[];
  uiHelper: UiHelper;
}

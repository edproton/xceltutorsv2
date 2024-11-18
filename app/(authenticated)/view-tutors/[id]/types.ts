export interface TutorAvailability {
  weekday: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

export interface TutorServices {
  subject: string;
  level: string;
  price: number;
}

export interface TutorWithAvailabilityAndServices {
  id: string;
  name: string;
  avatar: string;
  hasAlreadyBeenContacted: boolean;
  metadata: {
    bio: {
      full: string;
      short: string;
      session: string;
    };
    completedLessons: number;
    reviews: number;
    tags: string[];
    trustedBySchools: boolean;
    degree: string;
    grades: Array<{
      grade: string;
      level: string;
      subject: string;
    }>;
    university: string;
  };
  services: TutorServices[];
  availabilities: TutorAvailability[];
}

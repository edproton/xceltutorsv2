export interface TutorWithPrices {
  id: string;
  name: string;
  avatar: string;
  prices: number[];
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
}

export interface PageResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

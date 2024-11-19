export interface PageResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export type PriceRange =
  | { min: number; max: number } // When prices are different
  | { value: number }; // When prices are the same

export interface TutorQueryResult {
  id: string;
  name: string;
  avatarUrl: string;
  priceRange: PriceRange;
  bioShort: string;
  tags: string[];
  degree: string;
  university: string;
  completedLessons: number;
  reviews: number;
}

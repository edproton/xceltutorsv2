import { TutorMetadata } from "@/lib/database/types";

export interface TutorWithPrices {
  id: string;
  name: string;
  avatar: string;
  prices: number[];
  metadata: TutorMetadata;
}

export interface PageResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

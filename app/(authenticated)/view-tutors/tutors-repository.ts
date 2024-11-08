import { env } from "@/env/client";
import { createClient } from "@/lib/pocket-base";

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  metadata: {
    bio: {
      short: string;
      main: string;
      session: string;
    };
    completedLessons: number;
    reviews: number;
    tags: string[];
    trustedBySchools: boolean;
    degree: string;
    grades: Array<{
      grade: string;
      qualification: string;
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

interface TutorResponse {
  id: string;
  metadata: {
    bio: {
      short: string;
      main: string;
      session: string;
    };
    completedLessons: number;
    reviews: number;
    tags: string[];
    trustedBySchools: boolean;
    degree: string;
    grades: Array<{
      grade: string;
      qualification: string;
      subject: string;
    }>;
    university: string;
  };
  expand: {
    tutor: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

export default class TutorsRepository {
  static async getTutors(pageNumber: number): Promise<PageResponse<Tutor>> {
    const client = createClient();
    const response = (await client.collection("tutors").getList(pageNumber, 5, {
      sort: "-created",
      expand: "tutor",
    })) as PageResponse<TutorResponse>;

    return {
      page: response.page,
      perPage: response.perPage,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
      items: response.items.map((item) => ({
        id: item.id,
        name: item.expand.tutor.name,
        metadata: item.metadata,
        avatar: `${env.NEXT_PUBLIC_PB}/api/files/_pb_users_auth_/${item.expand.tutor.id}/${item.expand.tutor.avatar}`,
      })),
    };
  }
}

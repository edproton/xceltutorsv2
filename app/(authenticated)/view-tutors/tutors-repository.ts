import { env } from "@/env/client";
import { createClient } from "@/lib/pocket-base";
import { getUserFromCookie } from "@/lib/auth";

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  metadata: TutorMetadata;
}

export interface TutorMetadata {
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
}

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

export interface TutorWithAvailabilityAndServices extends Tutor {
  services: TutorServices[];
  availabilities: TutorAvailability[];
}

interface TutorResponse {
  id: string;
  metadata: TutorMetadata;
  expand: {
    tutor: {
      id: string;
      name: string;
      avatar: string;
    };
    tutors_availabilities_via_tutor: TutorAvailability[];
    tutors_services_via_tutor: ServiceResponse[];
  };
}

interface ServiceResponse {
  id: string;
  price: number;
  expand: {
    level: {
      id: string;
      name: string;
    };
    subject: {
      id: string;
      name: string;
    };
  };
}

export type TutorWithPrices = Tutor & {
  prices: number[];
};

export interface PageResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export default class TutorsRepository {
  // Fetch the user data from the cookie
  private static async getAuthenticatedClient() {
    const client = await createClient();
    const userData = await getUserFromCookie();

    if (userData?.token) {
      client.authStore.save(userData.token, userData);
    }

    return client;
  }

  // Get a tutor by ID with expanded availability and services
  static async getTutorById(
    id: string
  ): Promise<TutorWithAvailabilityAndServices> {
    const client = await this.getAuthenticatedClient();

    const response = await client
      .collection("tutors")
      .getOne<TutorResponse>(id, {
        expand:
          "tutor,tutors_availabilities_via_tutor,tutors_services_via_tutor.level,tutors_services_via_tutor.subject",
        fields: `
        metadata,
        expand.tutor.id,
        expand.tutor.name,
        expand.tutor.avatar,
        expand.tutors_availabilities_via_tutor.weekday,
        expand.tutors_availabilities_via_tutor.morning,
        expand.tutors_availabilities_via_tutor.afternoon,
        expand.tutors_availabilities_via_tutor.evening,
        expand.tutors_services_via_tutor.price,
        expand.tutors_services_via_tutor.expand.level.name,
        expand.tutors_services_via_tutor.expand.subject.name
      `,
      });

    const services = response.expand["tutors_services_via_tutor"].map(
      (service) => ({
        subject: service.expand.subject?.name ?? "Unknown Subject",
        level: service.expand.level?.name ?? "Unknown Level",
        price: service.price,
      })
    );

    const availabilities = response.expand[
      "tutors_availabilities_via_tutor"
    ].map((availability) => ({
      weekday: availability.weekday,
      morning: availability.morning,
      afternoon: availability.afternoon,
      evening: availability.evening,
    }));

    return {
      id: response.id,
      name: response.expand.tutor.name,
      avatar: `${env.NEXT_PUBLIC_PB}/api/files/_pb_users_auth_/${response.expand.tutor.id}/${response.expand.tutor.avatar}`,
      metadata: response.metadata,
      availabilities,
      services,
    };
  }

  // Get a paginated list of tutors with basic information and prices
  static async getTutors(
    pageNumber: number
  ): Promise<PageResponse<TutorWithPrices>> {
    const client = await this.getAuthenticatedClient();

    const response = await client
      .collection("tutors")
      .getList<TutorResponse>(pageNumber, 5, {
        sort: "-created",
        expand: "tutor,tutors_services_via_tutor",
        fields: `
        id,
        metadata,
        expand.tutor.name,
        expand.tutor.id,
        expand.tutor.avatar,
        expand.tutors_services_via_tutor.price
      `,
      });

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
        prices: item.expand.tutors_services_via_tutor.map(
          (service) => service.price
        ),
      })),
    };
  }
}

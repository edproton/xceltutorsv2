import { createClient } from "@/lib/supabase/server";

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  metadata: TutorMetadata;
}

export interface TutorMetadata {
  bio: {
    full: string;
    short: string;
    session: string;
  };
  completedLessons: number;
  reviews: number;
  tags: string[];
  trustedBySchools: boolean | null;
  degree: string;
  grades: Array<{
    grade: string;
    level: string;
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
  // Get a tutor by ID with expanded availability and services
  static async getTutorById(
    id: string
  ): Promise<TutorWithAvailabilityAndServices> {
    const client = await createClient();

    // Step 1: Fetch paginated data with related profiles
    const tutorQuery = await client
      .from("tutors")
      .select(
        `
        id,
        metadata,
        profiles (name, avatar),
        tutors_services (
          price,
          levels (name, subjects (name))
        ),
        tutors_availabilities (weekday, morning, afternoon, evening)
      `
      )
      .eq("id", id)
      .single();

    if (tutorQuery.error) {
      throw new Error(`Failed to fetch data: ${tutorQuery.error.message}`);
    }

    // Map availabilities to the required structure
    const response = tutorQuery.data;

    const metadata = tutorQuery.data.metadata as {
      bio: {
        full: string;
        short: string;
        session: string;
      };
      tags: string[];
      degree: string;
      grades: Array<{
        grade: string;
        level: string;
        subject: string;
      }>;
      reviews: number;
      university: string;
      completed_lessons: number;
      trusted_by_schools: boolean;
    };

    // Map the response to the expected structure
    const tutorWithDetails = {
      id: response.id,
      name: response.profiles?.name ?? "Unknown Tutor",
      avatar: response.profiles?.avatar ?? "",
      metadata: {
        bio: {
          full: metadata.bio.full ?? "",
          short: metadata.bio.short ?? "",
          session: metadata.bio.session ?? "",
        },
        completedLessons: metadata.completed_lessons ?? 0,
        reviews: metadata.reviews ?? 0,
        tags: metadata.tags ?? [],
        trustedBySchools: metadata.trusted_by_schools ?? false,
        degree: metadata.degree ?? "",
        grades: metadata.grades.map((grade) => ({
          grade: grade.grade,
          level: grade.level,
          subject: grade.subject,
        })),
        university: metadata.university ?? "",
      },
      services: response.tutors_services.map((service) => ({
        subject: service.levels?.subjects?.name ?? "Unknown Subject",
        level: service.levels?.name ?? "Unknown Level",
        price: service.price,
      })),
      availabilities: response.tutors_availabilities.map((availability) => ({
        weekday: availability.weekday,
        morning: availability.morning,
        afternoon: availability.afternoon,
        evening: availability.evening,
      })),
    };

    return tutorWithDetails;
  }

  static async getTutors(
    pageNumber: number
  ): Promise<PageResponse<TutorWithPrices>> {
    const client = await createClient();

    const perPage = 5; // Fixed page size
    const offset = (pageNumber - 1) * perPage;

    // Step 1: Fetch paginated data with related profiles
    const tutorsQuery = await client
      .from("tutors")
      .select(
        `
        id,
        metadata,
        profiles (name, avatar),
        tutors_services (price)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + perPage - 1);

    if (tutorsQuery.error) {
      throw new Error(`Failed to fetch data: ${tutorsQuery.error.message}`);
    }

    // Step 2: Get total count of items
    const { count, error: countError } = await client
      .from("tutors")
      .select("id", { count: "exact", head: true });

    if (countError) {
      throw new Error(`Failed to fetch count: ${countError.message}`);
    }

    // Step 3: Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    // Type-safe data mapping
    return {
      page: pageNumber,
      perPage: perPage,
      totalItems: totalItems,
      totalPages: totalPages,
      items: tutorsQuery.data.map((item) => {
        const metadata = item.metadata as {
          bio: {
            full: string;
            short: string;
            session: string;
          };
          tags: string[];
          degree: string;
          grades: Array<{
            grade: string;
            level: string;
            subject: string;
          }>;
          reviews: number;
          university: string;
          completed_lessons: number;
          trusted_by_schools: boolean;
        };

        return {
          id: item.id,
          name: item.profiles?.name ?? "Unknown Tutor",
          avatar: item.profiles?.avatar ?? "",
          prices: item.tutors_services.map((service) => service.price),
          metadata: {
            bio: {
              full: metadata?.bio?.full ?? "",
              short: metadata?.bio?.short ?? "",
              session: metadata?.bio?.session ?? "",
            },
            completedLessons: metadata?.completed_lessons ?? 0,
            reviews: metadata?.reviews ?? 0,
            tags: metadata?.tags ?? [],
            trustedBySchools: metadata?.trusted_by_schools ?? false,
            degree: metadata?.degree ?? "",
            grades:
              metadata?.grades?.map((grade) => ({
                grade: grade.grade,
                level: grade.level,
                subject: grade.subject,
              })) ?? [],
            university: metadata?.university ?? "",
          },
        };
      }),
    };
  }
}

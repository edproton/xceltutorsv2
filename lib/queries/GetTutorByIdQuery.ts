import { db } from "@/lib/database";
import { ResponseWrapper, TutorMetadata } from "@/lib/types";
import { GetFreeMeetingQuery } from "./GetFreeMeetingQuery";

type TutorRow = {
  id: string;
  avatar: string;
  metadata: TutorMetadata;
  price: string;
  afternoon: boolean;
  evening: boolean;
  morning: boolean;
  weekday: string;
  tutorName: string;
  levelName: string;
  subjectName: string;
};

type Service = {
  subject: string;
  level: string;
  price: string;
};

type Availability = {
  weekday: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};

export type GetTutorByIdQueryResponse = {
  id: string;
  name: string;
  avatar: string;
  metadata: TutorMetadata;
  services: Service[];
  availabilities: Availability[];
  uiHelper: {
    hasAlreadyHadDemoBooking: boolean;
    multiplePrices?: {
      minPrice: number;
      maxPrice: number;
    };
  };
};

export class GetTutorByIdQuery {
  private static mapTutorData(data: TutorRow): GetTutorByIdQueryResponse {
    const tutor: GetTutorByIdQueryResponse = {
      id: data.id,
      name: data.tutorName,
      avatar: data.avatar,
      metadata: data.metadata,
      services: [],
      availabilities: [],
      uiHelper: {
        hasAlreadyHadDemoBooking: false,
      },
    };

    const servicesMap = new Map<string, Service>();
    const availabilitiesMap = new Map<string, Availability>();

    if (data.subjectName && data.levelName && data.price) {
      const serviceKey = `${data.subjectName}-${data.levelName}-${data.price}`;
      if (!servicesMap.has(serviceKey)) {
        servicesMap.set(serviceKey, {
          subject: data.subjectName,
          level: data.levelName,
          price: data.price,
        });
      }
    }

    if (data.weekday) {
      const availabilityKey = `${data.weekday}-${data.morning}-${data.afternoon}-${data.evening}`;
      if (!availabilitiesMap.has(availabilityKey)) {
        availabilitiesMap.set(availabilityKey, {
          weekday: data.weekday,
          morning: data.morning,
          afternoon: data.afternoon,
          evening: data.evening,
        });
      }
    }

    tutor.services = Array.from(servicesMap.values());
    tutor.availabilities = Array.from(availabilitiesMap.values());

    const uniquePrices = new Set(
      tutor.services.map((service) => Number(service.price))
    );

    if (uniquePrices.size > 1) {
      tutor.uiHelper.multiplePrices = {
        minPrice: Math.min(...uniquePrices),
        maxPrice: Math.max(...uniquePrices),
      };
    }

    return tutor;
  }

  static async execute(
    userId: string,
    tutorId: string
  ): Promise<ResponseWrapper<GetTutorByIdQueryResponse>> {
    const data = await db
      .selectFrom("tutors")
      .innerJoin("profiles", "profiles.id", "tutors.profileId")
      .leftJoin("tutorsServices", "tutorsServices.tutorId", "tutors.id")
      .leftJoin("levels", "levels.id", "tutorsServices.levelId")
      .leftJoin("subjects", "subjects.id", "levels.subjectId")
      .leftJoin(
        "tutorsAvailabilities",
        "tutorsAvailabilities.tutorId",
        "tutors.id"
      )
      .where("tutors.id", "=", tutorId)
      .where("avatar", "is not", null)
      .where("tutorsServices.price", "is not", null)
      .where("levels.name", "is not", null)
      .where("subjects.name", "is not", null)
      .select([
        "tutors.id",
        "profiles.name as tutorName",
        "profiles.avatar",
        "tutors.metadata",
        "tutorsServices.price",
        "levels.name as levelName",
        "subjects.name as subjectName",
        "tutorsAvailabilities.weekday",
        "tutorsAvailabilities.morning",
        "tutorsAvailabilities.afternoon",
        "tutorsAvailabilities.evening",
      ])
      .$castTo<TutorRow>()
      .executeTakeFirst();

    if (!data) {
      return ResponseWrapper.fail("Tutor not found.");
    }

    const tutorProfile = this.mapTutorData(data);

    const getFreeMeetingQueryResponse = await GetFreeMeetingQuery.execute(
      userId,
      tutorId
    );

    if (getFreeMeetingQueryResponse.error) {
      return ResponseWrapper.fail(getFreeMeetingQueryResponse.error);
    }

    tutorProfile.uiHelper.hasAlreadyHadDemoBooking =
      getFreeMeetingQueryResponse.data !== undefined;

    return ResponseWrapper.success(tutorProfile);
  }
}

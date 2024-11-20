import { db } from "@/lib/database";
import { Level, Profile, ResponseWrapper } from "@/lib/types";

type GetTutorWithGroupedServicesQueryRow = {
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  subjectName: string;
  levelId: number;
  levelName: string;
};

export type GetTutorWithGroupedServicesQueryResponse = Profile & {
  subjects: SubjectWithLevels[];
};

type SubjectWithLevels = {
  name: string;
  levels: Level[];
};

export class GetTutorWithGroupedServicesQuery {
  private static mapToResponse(
    rowData: GetTutorWithGroupedServicesQueryRow[]
  ): GetTutorWithGroupedServicesQueryResponse {
    const subjectMap = new Map<string, Set<Level>>();

    rowData.forEach((row) => {
      const subjectName = row.subjectName;
      const level: Level = {
        id: row.levelId,
        name: row.levelName,
      };

      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, new Set());
      }
      subjectMap.get(subjectName)!.add(level);
    });

    const subjects: SubjectWithLevels[] = Array.from(subjectMap.entries()).map(
      ([name, levels]) => ({
        name,
        levels: Array.from(levels),
      })
    );

    return {
      id: rowData[0].tutorId,
      name: rowData[0].tutorName || "Unknown Tutor",
      avatar: rowData[0].tutorAvatar || "",
      subjects,
    };
  }

  static async execute(
    userId: string,
    tutorId: string
  ): Promise<ResponseWrapper<GetTutorWithGroupedServicesQueryResponse>> {
    try {
      // Step 1: Validate User Profile
      const userProfile = await db
        .selectFrom("profiles")
        .select(["id"])
        .where("id", "=", userId)
        .executeTakeFirst();

      if (!userProfile) {
        return ResponseWrapper.fail("User profile not found.");
      }

      // Step 2: Fetch Tutor Data and Grouped Services
      const tutorData = await db
        .selectFrom("tutors")
        .innerJoin("profiles", "tutors.profileId", "profiles.id")
        .leftJoin("tutorsServices", "tutors.id", "tutorsServices.tutorId")
        .leftJoin("levels", "tutorsServices.levelId", "levels.id")
        .innerJoin("subjects", "levels.subjectId", "subjects.id")
        .select([
          "tutors.id as tutorId",
          "profiles.name as tutorName",
          "profiles.avatar as tutorAvatar",
          "subjects.name as subjectName",
          "levels.id as levelId",
          "levels.name as levelName",
        ])
        .$castTo<GetTutorWithGroupedServicesQueryRow>()
        .where("tutors.id", "=", tutorId)
        .execute();

      if (tutorData.length === 0) {
        return ResponseWrapper.fail("Tutor not found.");
      }

      const result = this.mapToResponse(tutorData);

      return ResponseWrapper.success(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseWrapper.fail(
          `Failed to fetch tutor data: ${error.message}`
        );
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while fetching tutor data."
      );
    }
  }
}

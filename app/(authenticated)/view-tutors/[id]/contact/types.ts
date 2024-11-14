export type Level = {
  id: number;
  name: string;
};

export type SubjectWithLevels = {
  name: string;
  levels: Level[];
};

export type TutorInfo = {
  id: string;
  name: string;
  avatar: string;
  subjects: SubjectWithLevels[];
};
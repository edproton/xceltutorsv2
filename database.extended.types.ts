import { Database as PostgresSchema } from "./database.types";
import { MessageContent } from "./lib/types";

type PostgresTables = PostgresSchema["public"]["Tables"];

// <START>
type TableExtensions = {
  messages: {
    content: MessageContent[];
  };
  tutors: {
    metadata: {
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
  };
  bookings: {
    metadata: {
      levelId: number;
    };
  };
};
// <END>

type TakeDefinitionFromSecond<T extends object, P extends object> = Omit<
  T,
  keyof P
> &
  P;

type NewTables = {
  [k in keyof PostgresTables]: {
    Row: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<PostgresTables[k]["Row"], TableExtensions[k]>
      : PostgresTables[k]["Row"];
    Insert: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<
          PostgresTables[k]["Insert"],
          TableExtensions[k]
        >
      : PostgresTables[k]["Insert"];
    Update: k extends keyof TableExtensions
      ? Partial<
          TakeDefinitionFromSecond<
            PostgresTables[k]["Update"],
            TableExtensions[k]
          >
        >
      : PostgresTables[k]["Update"];
  };
};

export type Database = {
  public: Omit<PostgresSchema["public"], "Tables"> & {
    Tables: NewTables;
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> =
  Database["public"]["Tables"][T]["Row"];

export type TableView<View extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][View]["Row"];

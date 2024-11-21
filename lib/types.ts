export interface TextMessage {
  type: "text";
  text: string;
}

export type CardColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "gray"
  | "pink"
  | "teal"
  | "cyan"
  | "lime"
  | "amber"
  | "orange"
  | "default";

export interface CardMessage {
  type: "card";
  title: string;
  description: string;
  imageUrl?: string;
  actions?: {
    color?: CardColor;
    label: string;
    url?: string;
    callback?: {
      name: string;
      params: Record<string, string>;
    };
  }[];
}

export type MessageContent = TextMessage | CardMessage;

export type VisibleTo = "from" | "to" | "both";

export interface Message {
  id: number;
  conversation_id: number;
  sender_profile_id: string;
  content: MessageContent[];
  created_at: string;
  is_read: boolean;
  visible_to: VisibleTo;
}

export interface TutorBio {
  full: string;
  short: string;
  session: string;
}

export interface TutorMetadata {
  bio: TutorBio;
  tags: string[];
  degree: string;
  grades: { grade: string; level: string; subject: string }[];
  reviews: number;
  university: string;
  completedLessons: number;
  trustedBySchools: boolean;
}

export type BookingStatus =
  | "PendingDate"
  | "WaitingPayment"
  | "PaymentFailed"
  | "Confirmed"
  | "Canceled"
  | "Completed";

export type BookingType = "Free Meeting" | "Lesson";

export type Profile = {
  id: string;
  name: string;
  avatar: string;
};

export type Booking = {
  id: number;
  startTime: string; // London ISO string
  endTime: string; // London ISO string
  type: BookingType;
  status: BookingStatus;
  createdBy: Profile;
  forTutor: Profile;
  subject: {
    name: string;
    level: {
      name: string;
    };
  };
};

export type Level = {
  id: number;
  name: string;
};

export type PageResponse<T> = {
  items: T[];
  pageSize: number;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
};

export type ResponseError = {
  message: string;
  additionalData: Record<string, unknown>;
};

/**
 * A generic type representing a response that can either succeed with data or fail with an error.
 *
 * @template T - The type of the data contained in the response.
 */
export type Response<T> =
  | {
      /**
       * Indicates the absence of data in a failure case.
       */
      data: null;

      /**
       * The error message describing why the response failed.
       */
      error: ResponseError;
    }
  | {
      /**
       * The valid data returned in a successful response.
       */
      data: T;

      /**
       * Indicates the absence of an error in a success case.
       */
      error: null;
    };

/**
 * A generic wrapper class for handling responses that can either be a success or a failure.
 *
 * @template T - The type of data contained in the response.
 */
export class ResponseWrapper<T> {
  /**
   * The underlying response object.
   */
  private response: Response<T>;

  /**
   * Private constructor to initialize the ResponseWrapper with a response.
   * Use static methods `success` or `fail` to create an instance.
   *
   * @param response - The response object to wrap.
   */
  private constructor(response: Response<T>) {
    this.response = response;
  }

  /**
   * Creates a new `ResponseWrapper` instance by wrapping a `Response` object.
   *
   * @template T - The type of data contained in the response.
   * @param options - Partial response data with either `data` or `error`.
   * @returns A wrapped response.
   */
  private static wrap<T>({
    data,
    error,
  }: Partial<Response<T>>): ResponseWrapper<T> {
    if (error) {
      return new ResponseWrapper<T>({ data: null, error });
    }

    return new ResponseWrapper<T>({ data: data as T, error: null });
  }

  /**
   * Checks if the response is an error.
   *
   * @returns `true` if the response contains an error, otherwise `false`.
   */
  private get isError(): boolean {
    return this.response.data === null && this.response.error !== null;
  }

  /**
   * Getter for the `data` in the response.
   * Throws an error if called on an error response.
   *
   * @throws Will throw an error if the response is a failure.
   * @returns The data of the response.
   */
  get data(): T {
    if (this.isError) {
      throw new Error(
        `Cannot get data from an error response: ${this.response.error}`
      );
    }
    return this.response.data!;
  }

  /**
   * Getter for the `error` message in the response.
   *
   * @returns The error message if the response is a failure, or `null` if it is a success.
   */
  get error(): string | null {
    return this.response.error?.message ?? null;
  }

  get errorData(): ResponseError | null {
    return this.response.error ?? null;
  }

  /**
   * Creates a successful `ResponseWrapper` with the provided data.
   *
   * @template T - The type of data contained in the response.
   * @param data - The data to include in the response.
   * @throws Will throw an error if the data is `null`.
   * @returns A `ResponseWrapper` instance representing a success.
   */
  static success<T>(data: T): ResponseWrapper<T> {
    if (data === null) {
      throw new Error("Data cannot be null in success response");
    }

    return ResponseWrapper.wrap({ data });
  }

  /**
   * Creates a successful `ResponseWrapper` with no data (void operation).
   *
   * @returns A `ResponseWrapper` instance representing a success with no data.
   */
  static empty(): ResponseWrapper<void> {
    return ResponseWrapper.wrap({ data: undefined });
  }

  /**
   * Creates a failed `ResponseWrapper` with the provided error message.
   *
   * @param error - The error message to include in the response.
   * @param additionalData - Additional data to include in the response.
   * @returns A `ResponseWrapper` instance representing a failure.
   */
  static fail(
    error: string,
    additionalData?: Record<string, unknown>
  ): ResponseWrapper<never> {
    return ResponseWrapper.wrap({
      error: {
        message: error,
        additionalData: additionalData ?? {},
      },
    });
  }
}

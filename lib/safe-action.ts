import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export class ResultError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof ResultError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

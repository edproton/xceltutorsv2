import PocketBase from "pocketbase";

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_PB) {
    throw new Error("NEXT_PUBLIC_PB environment variable is not defined");
  }

  return new PocketBase(process.env.NEXT_PUBLIC_PB);
};

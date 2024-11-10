import PocketBase from "pocketbase";
import { getUserFromCookie } from "@/lib/auth";

let client: PocketBase | null = null;

export const createClient = async () => {
  if (!process.env.NEXT_PUBLIC_PB) {
    throw new Error("NEXT_PUBLIC_PB environment variable is not defined");
  }

  if (!client) {
    client = new PocketBase(process.env.NEXT_PUBLIC_PB);
    client.autoCancellation(false);

    const userData = await getUserFromCookie();

    if (userData && userData.token) {
      client.authStore.save(userData.token, userData.record);
    }
  }

  // Check if the token is expired and clear the auth store if necessary
  if (client.authStore.isValid) {
    const isExpired =
      client.authStore.token && client.authStore.model?.exp < Date.now() / 1000;
    if (isExpired) {
      client.authStore.clear();
      console.warn("Authentication token has expired. Clearing auth store.");
    }
  }

  return client;
};

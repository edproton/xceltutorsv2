// lib/auth.ts
"use server";

import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./constants";
import { cookies } from "next/headers";

export async function getUserFromCookie(request?: NextRequest) {
  if (request) {
    const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!cookieValue) return null;

    try {
      const authData = JSON.parse(decodeURIComponent(cookieValue));
      return authData?.record ?? null;
    } catch (error) {
      console.error("Failed to parse auth cookie:", error);
      return null;
    }
  }

  const cookiesData = await cookies();
  const cookieValue = cookiesData.get(AUTH_COOKIE_NAME)?.value;

  if (!cookieValue) return null;

  try {
    const authData = JSON.parse(decodeURIComponent(cookieValue));
    return authData ?? null;
  } catch (error) {
    console.error("Failed to parse auth cookie:", error);
    return null;
  }
}

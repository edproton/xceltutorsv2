import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env/client";
import PocketBase from "pocketbase";
import { cookies } from "next/headers";
import { z } from "zod";

// Types for better type safety
interface OAuthCallbackParams {
  provider: string;
}

// Validation schema for required parameters
const callbackParamsSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
});

// Constants
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
const AUTH_COOKIE_NAME = "pb_auth";

// Custom error class for OAuth errors
class OAuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = "auth_failed",
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "OAuthError";
  }
}

// Utility functions
const createRedirectResponse = (path: string): NextResponse => {
  return NextResponse.redirect(new URL(path, env.NEXT_PUBLIC_APP_URL));
};

const getErrorRedirectUrl = (errorCode: string): string => {
  return `/auth/error?error=${errorCode}`;
};

const setupAuthCookie = (
  response: NextResponse,
  authCookie: string
): NextResponse => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: authCookie,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
};

// Main handler
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<OAuthCallbackParams> }
): Promise<NextResponse> {
  try {
    const { provider } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate required parameters
    const validationResult = callbackParamsSchema.safeParse({
      code: searchParams.get("code"),
      state: searchParams.get("state"),
    });

    if (!validationResult.success) {
      throw new OAuthError("Missing or invalid parameters", "missing_params");
    }

    const { code } = validationResult.data;

    // Get code verifier from cookies
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get(`${provider}_verifier`)?.value;

    if (!codeVerifier) {
      throw new OAuthError("Missing code verifier", "missing_verifier");
    }

    // Initialize PocketBase
    const pb = new PocketBase(env.NEXT_PUBLIC_PB);
    const redirectUrl = `${env.NEXT_PUBLIC_APP_URL}/api/auth/${provider}/callback`;

    // Authenticate user
    const authData = await pb
      .collection("users")
      .authWithOAuth2Code(provider, code, codeVerifier, redirectUrl);

    if (authData.meta?.rawUser) {
      // Prepare form data for user update
      const formData = new FormData();

      // Handle avatar upload if available
      const { avatarUrl } = authData.meta;

      if (avatarUrl) {
        try {
          const avatarResponse = await fetch(avatarUrl);
          if (avatarResponse.ok) {
            const imageBlob = await avatarResponse.blob();
            formData.append("avatar", imageBlob);
          }
        } catch (error) {
          console.error("Failed to fetch avatar:", error);
          // Continue without avatar if fetch fails
        }
      }

      let name = authData.meta?.name;
      if (provider === "discord") {
        name = authData.meta.username;
      }

      if (provider === "google") {
        const { given_name, family_name } = authData.meta.rawUser;

        if (given_name && family_name) {
          name = `${given_name} ${family_name}`;
        }
      }

      formData.append("name", name);

      await pb.collection("users").update(authData.record.id, formData);
    }

    // Create successful response with auth cookie
    const response = createRedirectResponse("/dashboard");

    return setupAuthCookie(response, pb.authStore.exportToCookie());
  } catch (error) {
    // Enhanced error logging
    console.error("OAuth callback error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof OAuthError ? error.code : "auth_failed",
    });

    // Determine error code for redirect
    const errorCode = error instanceof OAuthError ? error.code : "auth_failed";

    return createRedirectResponse(getErrorRedirectUrl(errorCode));
  }
}

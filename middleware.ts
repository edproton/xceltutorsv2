import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Root path "/"
     * - Auth paths "/auth" (including any sub-paths like "/auth/*")
     */
    "/((?!_next/static|_next/image|favicon.ico|auth(?:/.*)?|$).*)",
  ],
};

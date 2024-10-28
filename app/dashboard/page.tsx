// app/dashboard/page.tsx
import { cookies } from "next/headers";
import PocketBase from "pocketbase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { env } from "@/env/client";

async function getUserData() {
  "use server";
  const pb = new PocketBase(env.NEXT_PUBLIC_PB);
  const authCookie = (await cookies()).get("pb_auth");

  if (!authCookie?.value) {
    return null;
  }

  // Load the auth data from cookie
  pb.authStore.loadFromCookie(authCookie.value);

  try {
    // Get full user data
    const userData = await pb
      .collection("users")
      .getOne(pb.authStore.model?.id);
    const authData = pb.authStore.model;

    return {
      user: userData,
      auth: authData,
      cookie: authCookie.value,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getUserData();

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-red-500 text-center">
              Not authenticated. Please log in.
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/auth/providers">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, auth, cookie } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Name</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">ID</h3>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Verified</h3>
              <p>{user.verified ? "Yes" : "No"}</p>
            </div>
            {user.provider && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Provider
                </h3>
                <p>{user.provider}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Created</h3>
              <p>{new Date(user.created).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Updated</h3>
              <p>{new Date(user.updated).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auth Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(auth, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Cookie Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cookie Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
            <code className="text-sm break-all font-mono">{cookie}</code>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <div className="flex justify-end">
        <form action="/api/auth/logout" method="POST">
          <Button variant="destructive">Logout</Button>
        </form>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import MainNav from "./main-nav";
import {
  GetUserProfileQuery,
  GetUserProfileQueryResponse,
} from "@/lib/queries/GetUserProfileQuery";
import { ResponseWrapper } from "@/lib/types";

async function getUser(): Promise<
  ResponseWrapper<GetUserProfileQueryResponse>
> {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return ResponseWrapper.fail(sessionError.message);
  }

  const { data, error } = await GetUserProfileQuery.execute(
    sessionData!.session!.user.id
  );

  if (error) {
    return ResponseWrapper.fail(error);
  }

  return ResponseWrapper.success({
    id: sessionData!.session!.user.id,
    name: data!.name,
    email: sessionData!.session!.user.email,
    avatar: data!.avatar,
    role: data.role,
  });
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = await getUser();
  if (error) {
    return <div>Error loading profile data</div>;
  }

  return (
    <>
      <MainNav user={data} />
      <div className="mt-14">{children}</div>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import MainNav from "./main-nav";

async function getUser() {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return {
      error: sessionError,
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("name, avatar")
    .eq("id", sessionData.session!.user.id)
    .single();

  if (error) {
    return {
      error,
    };
  }

  return {
    data,
  };
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
      <MainNav name={data.name} avatar={data.avatar} />
      <div className="mt-14">{children}</div>
    </>
  );
}

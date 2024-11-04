import { Metadata } from "next";
import { loadOAuthProviders } from "./actions";
import AuthPage from "./auth-page";

export const metadata: Metadata = {
  title: "Sign In | xceltutors",
  description:
    "Access your personalized tutoring dashboard and start your journey towards academic excellence with xceltutors.",
  openGraph: {
    title: "Sign In to xceltutors",
    description:
      "Join xceltutors for personalized tutoring and academic excellence.",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In to xceltutors",
    description:
      "Join xceltutors for personalized tutoring and academic excellence.",
    images: ["/og-image.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function LoginPageWrapper() {
  const providers = await loadOAuthProviders();

  if (!providers || !providers.data?.authProviders) {
    return <div>Not found</div>;
  }

  return <AuthPage authProviders={providers.data!.authProviders} />;
}
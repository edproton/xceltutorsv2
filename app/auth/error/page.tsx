import { redirect } from "next/navigation";
import { Metadata } from "next";
import ErrorView from "./error-view";

interface ErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

// Error messages for metadata
const getErrorMetadata = (errorCode: string) => {
  const messages = {
    missing_params: "Invalid Request - XcelTutors",
    missing_verifier: "Authentication Error - XcelTutors",
    auth_failed: "Authentication Failed - XcelTutors",
    default: "Error - XcelTutors",
  };

  return messages[errorCode as keyof typeof messages] || messages.default;
};

// Dynamic metadata based on error type
export async function generateMetadata({
  searchParams,
}: ErrorPageProps): Promise<Metadata> {
  const { error } = await searchParams;
  const title = error ? getErrorMetadata(error) : "Error - XcelTutors";

  return {
    title,
    description:
      "Something went wrong. We're here to help you get back on track with XcelTutors.",
    keywords: ["XcelTutors", "error", "help", "support", "tutoring platform"],
    openGraph: {
      title,
      description:
        "Something went wrong. We're here to help you get back on track with XcelTutors.",
      type: "website",
      siteName: "XcelTutors",
    },
    twitter: {
      card: "summary",
      title,
      description:
        "Something went wrong. We're here to help you get back on track with XcelTutors.",
    },
  };
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams;

  // Redirect to home if no error code is provided
  if (!error) {
    redirect("/");
  }

  return <ErrorView errorCode={error} />;
}

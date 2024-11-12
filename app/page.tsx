import { Metadata } from "next";
import LandingPage from "./landing-page";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "XcelTutors - Personalized Tutoring to Help You Excel",
  description:
    "XcelTutors offers expert tutoring in Science, English, Maths, and more. Our personalized learning approach and flexible scheduling help students achieve their academic goals.",
  keywords:
    "tutoring, education, personalized learning, science tutor, english tutor, math tutor, online tutoring",
  authors: [{ name: "XcelTutors Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.xceltutors.com",
    siteName: "XcelTutors",
    title: "XcelTutors - Expert Tutoring for Academic Excellence",
    description:
      "Achieve your academic goals with XcelTutors. Personalized tutoring in Science, English, Maths, and more.",
    images: [
      {
        url: "https://www.xceltutors.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "XcelTutors - Personalized Tutoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XcelTutors - Personalized Tutoring to Help You Excel",
    description:
      "Expert tutoring in Science, English, Maths, and more. Achieve your academic goals with XcelTutors.",
    images: ["https://www.xceltutors.com/twitter-image.jpg"],
    creator: "@XcelTutors",
  },
};

export default async function LandingPageWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPage isLoggedIn={!!user} />;
}

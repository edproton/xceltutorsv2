import { Metadata } from "next";
import env from "@/env";
import { getTutorById } from "./actions";
import DemoBookingConfirmationPageContent from "./page-content";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutorById(id);

  return {
    title: `Booking Confirmation: Free Meeting with ${tutor.name} | Expert Tutoring`,
    description: `Your free tutoring session with ${tutor.name} is confirmed. Discuss your learning goals and experience personalized education. Start your journey to academic success today!`,
    keywords: [
      "tutoring",
      "free session",
      "education",
      "personalized learning",
      tutor.name,
    ],
    authors: [{ name: tutor.name }],
    openGraph: {
      title: `Free Tutoring Session with ${tutor.name} Confirmed`,
      description: `Your personalized learning journey begins here. Join ${tutor.name} for a free tutoring session and unlock your academic potential.`,
      url: `https://${env.NEXT_PUBLIC_APP_URL}/view-tutors/${id}/contact/confirmation`,
      siteName: "Expert Tutoring Platform",
      images: [
        {
          url: tutor.avatar,
          width: 1200,
          height: 630,
          alt: `Profile picture of tutor ${tutor.name}`,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

export default async function DemoBookingConfirmationPage({ params }: Props) {
  const { id } = await params;

  const tutor = await getTutorById(id);

  return <DemoBookingConfirmationPageContent tutor={tutor} />;
}

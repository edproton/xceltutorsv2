import { Metadata } from "next";
import { getTutorWithGroupedServicesCached } from "./actions";
import TutoringForm from "./components/tutoring-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutorWithGroupedServicesCached(id);

  return {
    title: `Free meeting with ${tutor.name} | Tutoring`,
    description: `Schedule a free meeting with ${tutor.name}. Discuss your tutoring needs and see if it's a good fit.`,
    openGraph: {
      images: [tutor.avatar],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { id } = await params;

  const tutor = await getTutorWithGroupedServicesCached(id);

  return <TutoringForm tutor={tutor} />;
}

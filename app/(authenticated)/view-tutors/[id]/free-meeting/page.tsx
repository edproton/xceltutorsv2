import { Metadata } from "next";
import TutoringForm from "./components/tutoring-form";
import { getTutorById } from "../actions";
import { getTutorWithGroupedServices } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutorById(id);

  if (!tutor) {
    return {
      title: "Tutor Not Found",
      description: "The tutor you are looking for could not be found.",
    };
  }

  return {
    title: `Free meeting with ${tutor.data.name} | Tutoring`,
    description: `Schedule a free meeting with ${tutor.data.name}. Discuss your tutoring needs and see if it's a good fit.`,
    openGraph: {
      images: [tutor.data.avatar],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { id } = await params;

  const actionResult = await getTutorWithGroupedServices(id);

  return <TutoringForm tutor={actionResult} />;
}

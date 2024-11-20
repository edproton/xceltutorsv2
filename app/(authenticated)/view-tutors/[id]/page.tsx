import type { Metadata } from "next";
import ViewTutorsByIdPageContent from "./page-content";
import { getTutorById } from "./actions";

interface ViewTutorsByIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ViewTutorsByIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: tutor, error } = await getTutorById(id);

  if (error) {
    return {
      title: "Tutor Not Found",
      description: "The tutor you are looking for could not be found.",
    };
  }

  return {
    title: `${tutor.name} - Tutor Profile`,
    description: `View the profile and availability of ${tutor.name}, one of our experienced tutors.`,
  };
}

export default async function ViewTutorsByIdPage({
  params,
}: ViewTutorsByIdPageProps) {
  const { id } = await params;
  const { data: tutor, error } = await getTutorById(id);
  if (error) {
    return <div>Tutor not found</div>;
  }

  return <ViewTutorsByIdPageContent tutor={tutor} />;
}

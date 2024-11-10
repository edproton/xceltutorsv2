import type { Metadata } from "next";
import TutorsRepository from "../tutors-repository";
import ViewTutorsByIdPageContent from "./page-content";

interface ViewTutorsByIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ViewTutorsByIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const tutor = await TutorsRepository.getTutorById(id);

  return {
    title: `${tutor.name} - Tutor Profile`,
    description: `View the profile and availability of ${tutor.name}, one of our experienced tutors.`,
  };
}

export default async function ViewTutorsByIdPage({
  params,
}: ViewTutorsByIdPageProps) {
  const { id } = await params;
  const tutor = await TutorsRepository.getTutorById(id);

  return <ViewTutorsByIdPageContent tutor={tutor} />;
}

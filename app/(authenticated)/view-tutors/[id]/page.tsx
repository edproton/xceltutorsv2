import TutorsRepository from "../tutors-repository";
import ViewTutorsByIdPageContent from "./page-content";

interface ViewTutorsByIdPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function ViewTutorsByIdPage({
  params,
}: ViewTutorsByIdPageProps) {
  const { id } = await params;

  const tutor = await TutorsRepository.getTutorById(id);

  return <ViewTutorsByIdPageContent tutor={tutor} />;
}

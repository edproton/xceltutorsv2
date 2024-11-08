import ViewTutorsPage from "./page-content";
import { redirect } from "next/navigation";
import TutorsRepository from "./tutors-repository";

export interface Tutor {
  id: string;
  name: string;
  degree: string;
  reviews: number;
  lessons: number;
  tags: string[];
  minHourlyRate: number;
  maxHourlyRate: number;
  bio: string;
  avatar: string | null;
}

export interface TutorsResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Tutor[];
}

type SearchParams = {
  page?: string;
};

const DEFAULT_PAGE = 1;

export default async function ViewTutorsPageWrapper({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const pageNumber = parsePageNumber(page);
  const tutors = await TutorsRepository.getTutors(pageNumber);

  console.log(tutors);

  if (pageNumber > tutors.totalPages) {
    redirect(`/view-tutors?page=${tutors.totalPages}`);
  }

  return <ViewTutorsPage tutors={tutors} />;
}

function parsePageNumber(page: string | undefined): number {
  const parsedPage = parseInt(page ?? "", 10);
  return isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;
}

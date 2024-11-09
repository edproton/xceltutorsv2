import type { Metadata } from "next";
import ViewTutorsPage from "./page-content";
import { redirect } from "next/navigation";
import TutorsRepository from "./tutors-repository";

type SearchParams = {
  page?: string;
};

export const metadata: Metadata = {
  title: "View Our Tutors",
  description:
    "Browse through our list of qualified tutors and find the perfect match for your learning needs.",
  openGraph: {
    title: "View Our Tutors",
    description:
      "Find your ideal tutor from our extensive list of qualified professionals.",
    type: "website",
    url: "https://xceltutors.com/view-tutors",
    images: [
      {
        url: "https://xceltutors.com/images/tutors-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Our Tutors",
      },
    ],
  },
};

export default async function ViewTutorsPageWrapper({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const pageNumber = parsePageNumber(page);
  const tutors = await TutorsRepository.getTutors(pageNumber);

  if (pageNumber > tutors.totalPages) {
    redirect(`/view-tutors?page=${tutors.totalPages}`);
  }

  return <ViewTutorsPage tutors={tutors} />;
}

function parsePageNumber(page: string | undefined): number {
  const parsedPage = parseInt(page ?? "", 10);
  return isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
}

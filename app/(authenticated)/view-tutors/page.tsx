import { createClient } from "@/lib/pocket-base";
import ViewTutorsPage from "./page-content";
import { redirect } from "next/navigation";

export interface Tutor {
    id: string
    name: string
    degree: string
    reviews: number
    lessons: number
    tags: string[]
    minHourlyRate: number
    maxHourlyRate: number
    bio: string
    avatar: string | null
}

export interface TutorsResponse {
    page: number
    perPage: number
    totalItems: number
    totalPages: number
    items: Tutor[]
}

async function getTutors(page: number): Promise<TutorsResponse> {
    const client = createClient();
    const tutors = await client.collection('tutors').getList(page, 5, {
        expand: 'tutor',
        sort: '-created'
    });

    return {
        page: tutors.page,
        perPage: tutors.perPage,
        totalItems: tutors.totalItems,
        totalPages: tutors.totalPages,
        items: tutors.items.map(item => ({
            id: item.id,
            name: item.expand?.tutor?.name || 'Unknown',
            degree: item.degree,
            reviews: item.reviews,
            lessons: item.lessons,
            tags: item.tags,
            minHourlyRate: item.min_hourly_rate,
            maxHourlyRate: item.max_hourly_rate,
            bio: item.bio,
            avatar: item.expand?.tutor?.avatar
                ? `https://bff.xceltutors.com/api/files/_pb_users_auth_/${item.expand.tutor.id}/${item.expand.tutor.avatar}`
                : null
        }))
    };
}


type SearchParams = {
    page?: string
}

const DEFAULT_PAGE = 1

export default async function ViewTutorsPageWrapper({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const { page } = await searchParams

    const pageNumber = parsePageNumber(page)
    const tutors = await getTutors(pageNumber)

    if (pageNumber > tutors.totalPages) {
        redirect(`/view-tutors?page=${tutors.totalPages}`)
    }

    return <ViewTutorsPage tutors={tutors} />
}

function parsePageNumber(page: string | undefined): number {
    const parsedPage = parseInt(page ?? '', 10)
    return isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage
}

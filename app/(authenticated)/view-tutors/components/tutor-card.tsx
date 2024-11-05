import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Tutor } from "../page"


export default function TutorCard({
    name,
    degree,
    reviews,
    lessons,
    tags,
    minHourlyRate,
    maxHourlyRate,
    bio,
    avatar
}: Tutor) {
    // Split degree into university and course
    const [university, course] = degree.split(" - ").map(s => s.trim())

    // Calculate rating
    const rating = reviews > 0 ? 5 : 0 // This should be calculated from actual ratings

    if (!tags || tags.length === 0) {
        tags = ["New tutor"]
    }

    console.log(avatar)

    return (
        <Card className="overflow-hidden">
            <div className="p-6 flex gap-6">
                <div className="flex-shrink-0">
                    {avatar ? (

                        <Image
                            src={avatar}
                            alt={`${name}'s profile picture`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                        />) : (
                        <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-2xl">?</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">{name}</h2>
                            {tags?.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className={
                                        tag === "Super tutor"
                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                            : "bg-green-50 text-green-700 hover:bg-green-50"
                                    }
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="text-right">
                            <div className="font-bold">
                                £{minHourlyRate}-£{maxHourlyRate}
                                <span className="text-sm font-normal text-muted-foreground">/hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-2">
                        <p className="text-sm">
                            {university}
                            {" - "}
                            <span>{course}</span>
                        </p>
                    </div>

                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">{bio}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                            <div className="flex items-center mr-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-200 fill-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground">{rating}/5</span>
                        </div>
                        <div className="text-muted-foreground">
                            {reviews} {reviews === 1 ? "review" : "reviews"}
                        </div>
                        <div className="text-muted-foreground">
                            {lessons} {lessons === 1 ? "lesson" : "lessons"}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
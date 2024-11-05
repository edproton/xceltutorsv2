"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { FilterSection } from "./components/filters-section"
import { TutorsResponse } from "./page"
import Pagination from "./components/pagination"
import TutorCard from "./components/tutor-card"

export default function ViewTutorsPage({
    tutors
}: {
    tutors: TutorsResponse
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Private tutors that fit your schedule
                </h1>
                <div className="flex items-center justify-center gap-1 mb-6">
                    <span className="text-sm text-muted-foreground">Excellent</span>
                    <span className="text-sm font-medium">4.8</span>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-4 w-4 fill-primary text-primary"
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">TrustPilot</span>
                </div>

                <FilterSection />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {tutors.items.map((tutor) => (
                        <TutorCard key={tutor.id} {...tutor} />
                    ))}
                    <Pagination
                        currentPage={tutors.page}
                        totalPages={tutors.totalPages}
                        baseUrl="/view-tutors"
                    />
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Star className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Looking for something more specific?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {"Give our tutor experts a call and they'll find you the perfect match."}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-medium">+44 (0) 203 773 6024</div>
                                <div className="text-sm text-muted-foreground">
                                    Our opening hours are Mon to Fri 9am to 6pm
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
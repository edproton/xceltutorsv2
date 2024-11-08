"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { FilterSection } from "./components/filters-section";
import Pagination from "./components/pagination";
import TutorCard from "./components/tutor-card";
import { PageResponse, Tutor } from "./tutors-repository";

export default function ViewTutorsPage({
  tutors,
}: {
  tutors: PageResponse<Tutor>;
}) {
  return (
    <div className="min-h-screen bg-background">
      <FilterSection />

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {tutors.items.map((tutor) => (
              <div key={tutor.id} className="w-full">
                <TutorCard tutor={tutor} />
              </div>
            ))}
            <Pagination
              currentPage={tutors.page}
              totalPages={tutors.totalPages}
              baseUrl="/view-tutors"
            />
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Looking for something more specific?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {
                        "Give our tutor experts a call and they'll find you the perfect match."
                      }
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
    </div>
  );
}

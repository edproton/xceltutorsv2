"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import ImprovedFilterSection from "./components/filters-section";
import Pagination from "./components/pagination";
import TutorCard from "./components/tutor-card";
import { GetTutorsPaginatedQueryResponse } from "@/lib/queries/GetTutorsPaginatedQuery";

export default function ViewTutorsPage({
  tutors,
}: {
  tutors: GetTutorsPaginatedQueryResponse;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Tutor</h1>
          <ImprovedFilterSection />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {tutors.items.map((tutor) => (
              <div key={tutor.id} className="w-full">
                <TutorCard tutor={tutor} />
              </div>
            ))}
            <Pagination
              pageNumber={tutors.pageNumber}
              totalPages={tutors.totalPages}
              baseUrl="/view-tutors"
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 z-40">
              <Card className="bg-card shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Need a specific tutor?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our experts will find your perfect match.
                      </p>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="font-medium text-xl">+351 913 135 123</div>
                    <div className="text-sm text-muted-foreground">
                      Mon to Fri, 9am to 6pm
                    </div>
                    <button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md transition-colors">
                      Request a Call Back
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

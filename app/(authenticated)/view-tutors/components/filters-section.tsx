"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AvailabilityFilter } from "./filters/availability-filter";
import { PriceFilter } from "./filters/price-filter";

export function FilterSection() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="md:sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md py-6 z-40">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  <SelectItem value="maths">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">
                Level
              </label>
              <Select>
                <SelectTrigger id="level">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="gcse">GCSE</SelectItem>
                  <SelectItem value="alevel">A-Level</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <PriceFilter />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="w-full md:w-auto"
              >
                {showMoreFilters ? (
                  <>
                    Less filters
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    More filters
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {showMoreFilters && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </label>
                  <Select>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="All genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="availability" className="text-sm font-medium">
                    Availability
                  </label>
                  <AvailabilityFilter />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

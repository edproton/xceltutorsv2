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
import AvailabilityFilter from "./filters/availability-filter";
import PriceFilter from "./filters/price-filter";

export default function ImprovedFilterSection() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="w-full bg-background">
      <div className="w-full max-w-[2000px] mx-auto px-6 py-6">
        <div className="flex gap-6 items-end">
          <div className="flex-1">
            <label htmlFor="subject" className="text-sm font-medium mb-2 block">
              Subject
            </label>
            <Select>
              <SelectTrigger id="subject" className="w-full">
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

          <div className="flex-1">
            <label htmlFor="level" className="text-sm font-medium mb-2 block">
              Level
            </label>
            <Select>
              <SelectTrigger id="level" className="w-full">
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

          <div className="flex-1">
            <label htmlFor="price" className="text-sm font-medium mb-2 block">
              Price
            </label>
            <PriceFilter />
          </div>

          <Button
            variant="outline"
            className="h-10 w-[140px]"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {showMoreFilters ? (
              <>
                Close filters
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                More filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {showMoreFilters && (
          <>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium mb-2 block"
                >
                  Gender
                </label>
                <Select>
                  <SelectTrigger id="gender" className="w-full">
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

              <div className="w-full">
                <label
                  htmlFor="availability"
                  className="text-sm font-medium mb-2 block"
                >
                  Availability
                </label>
                <AvailabilityFilter />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

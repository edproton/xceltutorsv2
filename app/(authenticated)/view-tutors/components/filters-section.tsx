"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronUp, ChevronDown } from "lucide-react"
import { AvailabilityFilter } from "./filters/availability-filter"
import { PriceFilter } from "./filters/price-filter"

export function FilterSection() {
    const [showMoreFilters, setShowMoreFilters] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (filterRef.current) {
                const filterTop = filterRef.current.getBoundingClientRect().top
                setIsSticky(filterTop <= 15) // Height of the navigation bar
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div ref={filterRef} className="relative">
            <div className={`transition-all duration-300 ${isSticky
                ? 'fixed top-14 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md py-4'
                : ''
                }`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <p className="text-sm mb-1">Subject</p>
                            <Select>
                                <SelectTrigger>
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
                            <p className="text-sm mb-1">Level</p>
                            <Select>
                                <SelectTrigger>
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
                            <p className="text-sm mb-1">Price</p>
                            <PriceFilter />
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={() => setShowMoreFilters(!showMoreFilters)}
                                className="text-primary hover:text-primary/90 hover:bg-transparent"
                            >
                                {showMoreFilters ? (
                                    <>
                                        Close filters
                                        <ChevronUp className="h-4 w-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        More filters
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {showMoreFilters && (
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <p className="text-sm mb-1">Gender</p>
                                <Select>
                                    <SelectTrigger>
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

                            <div className="flex-1">
                                <p className="text-sm mb-1">Availability</p>
                                <AvailabilityFilter />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isSticky && <div style={{ height: filterRef.current?.offsetHeight }}></div>}
        </div>
    )
}
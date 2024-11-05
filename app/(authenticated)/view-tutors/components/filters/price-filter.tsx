"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"

const priceRanges = [
    {
        id: "25-32",
        range: "£25 - £32",
        description: "New to MyTutor, with lots of availability and some great early reviews"
    },
    {
        id: "33-48",
        range: "£33 - £48",
        description: "Tutoring for over 6 months, completed lots of lessons and received very positive reviews"
    },
    {
        id: "49-67",
        range: "£49 - £67",
        description: "Our most accomplished tutors. Excellent reviews and a track record of proven results"
    }
]

export function PriceFilter() {
    const [open, setOpen] = React.useState(false)
    const [selectedPrices, setSelectedPrices] = React.useState<string[]>([])

    const handlePriceChange = (priceId: string) => {
        setSelectedPrices(prev => {
            if (prev.includes(priceId)) {
                return prev.filter(id => id !== priceId)
            }
            return [...prev, priceId]
        })
    }

    const handleClear = () => {
        setSelectedPrices([])
    }

    const handleApply = () => {
        setOpen(false)
        // Handle apply logic here
    }

    const getSelectedText = () => {
        if (selectedPrices.length === 0) return "All prices"
        return (
            <div className="flex flex-wrap gap-1">
                {selectedPrices
                    .sort((a, b) => {
                        const aStart = parseInt(a.split('-')[0])
                        const bStart = parseInt(b.split('-')[0])
                        return aStart - bStart
                    })
                    .map(id => {
                        const range = priceRanges.find(p => p.id === id)
                        return (
                            <Badge key={id} variant="secondary" className="rounded-sm">
                                £{range?.id.replace('-', ' - £')}
                            </Badge>
                        )
                    })}
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="flex-grow text-left">{getSelectedText()}</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
                <div className="space-y-4">
                    {priceRanges.map((price) => (
                        <div key={price.id} className="flex items-start space-x-3">
                            <Checkbox
                                id={price.id}
                                checked={selectedPrices.includes(price.id)}
                                onCheckedChange={() => handlePriceChange(price.id)}
                                className="mt-1 data-[state=checked]:bg-[#40B3A2] data-[state=checked]:border-[#40B3A2]"
                            />
                            <div className="space-y-1">
                                <label
                                    htmlFor={price.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {price.range}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    {price.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="text-sm text-muted-foreground"
                        >
                            Clear filters
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="bg-[#40B3A2] hover:bg-[#40B3A2]/90 text-white"
                        >
                            Apply filters
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
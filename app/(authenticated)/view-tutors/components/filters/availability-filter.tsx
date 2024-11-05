"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

const timeSlots = ["Before 12pm", "12-5pm", "After 5pm"]
const daysOfWeek = [
    { full: "Monday", short: "Mon" },
    { full: "Tuesday", short: "Tue" },
    { full: "Wednesday", short: "Wed" },
    { full: "Thursday", short: "Thu" },
    { full: "Friday", short: "Fri" },
    { full: "Saturday", short: "Sat" },
    { full: "Sunday", short: "Sun" },
]

export function AvailabilityFilter() {
    const [open, setOpen] = React.useState(false)
    const [availability, setAvailability] = React.useState<Record<string, boolean>>({})

    const handleCheckboxChange = (day: string, timeSlot: string) => {
        const key = `${day}-${timeSlot}`
        setAvailability(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleSelectAllForTimeSlot = (timeSlot: string) => {
        const allCheckedForSlot = daysOfWeek.every(day => availability[`${day.full}-${timeSlot}`])

        setAvailability(prev => {
            const newState = { ...prev }
            daysOfWeek.forEach(day => {
                newState[`${day.full}-${timeSlot}`] = !allCheckedForSlot
            })
            return newState
        })
    }

    const handleClear = () => {
        setAvailability({})
    }

    const handleApply = () => {
        setOpen(false)
    }

    const getSelectedText = () => {
        const selectedDays = daysOfWeek.filter(day =>
            timeSlots.some(slot => availability[`${day.full}-${slot}`])
        )

        if (selectedDays.length === 0) return "All Availability"
        return selectedDays.map(day => day.short).join(", ")
    }

    const isTimeSlotSelected = (timeSlot: string) => {
        return daysOfWeek.every(day => availability[`${day.full}-${timeSlot}`])
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
                    {getSelectedText()}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-1"></div>
                        {timeSlots.map((slot) => (
                            <div key={slot} className="text-xs font-medium text-center">
                                {slot}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-4 items-center">
                            <div className="text-sm">Select all</div>
                            <div className="col-span-3 grid grid-cols-3 gap-4">
                                {timeSlots.map((slot) => (
                                    <div key={slot} className="flex justify-center">
                                        <Checkbox
                                            checked={isTimeSlotSelected(slot)}
                                            onCheckedChange={() => handleSelectAllForTimeSlot(slot)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {daysOfWeek.map((day) => (
                            <div key={day.full} className="grid grid-cols-4 gap-4 items-center">
                                <div className="text-sm">{day.full}</div>
                                <div className="col-span-3 grid grid-cols-3 gap-4">
                                    {timeSlots.map((slot) => (
                                        <div key={`${day.full}-${slot}`} className="flex justify-center">
                                            <Checkbox
                                                checked={availability[`${day.full}-${slot}`] || false}
                                                onCheckedChange={() => handleCheckboxChange(day.full, slot)}
                                                className="data-[state=checked]:bg-[#40B3A2] data-[state=checked]:border-[#40B3A2]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

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
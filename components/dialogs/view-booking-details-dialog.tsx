"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  GraduationCap,
  Book,
  RepeatIcon,
  User,
} from "lucide-react";

interface TutoringData {
  tutorName: string;
  tutorAvatar: string;
  levelName: string;
  subjectName: string;
  meetingDate: string;
  meetingTime: string;
  frequency: string;
  message: string;
}

interface TutoringDetailsDialogProps {
  params: {
    bookingId: string;
  };
  onClose: () => void;
  setTitle: (title: string) => void;
}

export default function TutoringDetailsDialog({
  params,
  onClose,
  setTitle,
}: TutoringDetailsDialogProps) {
  const [tutoringData, setTutoringData] = useState<TutoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTitle("Tutoring Booking Details");

    const fetchTutoringData = async () => {
      setIsLoading(true);
      // Simulate API call
      // Mock tutoring data
      const mockData: TutoringData = {
        tutorName: "Dr. Jane Smith",
        tutorAvatar: "https://example.com/avatar.jpg",
        levelName: "Advanced",
        subjectName: "Mathematics",
        meetingDate: "2023-06-15",
        meetingTime: "14:00",
        frequency: "weekly",
        message:
          "I need help with advanced calculus concepts, particularly with multivariable calculus and vector analysis.",
      };
      setTutoringData(mockData);
      setIsLoading(false);
    };

    fetchTutoringData();
  }, [setTitle]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <>
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-[200px] bg-muted animate-pulse rounded" />
              <div className="h-4 w-[150px] bg-muted animate-pulse rounded" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={tutoringData?.tutorAvatar}
                alt={tutoringData?.tutorName}
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {tutoringData?.tutorName || "Unknown Tutor"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Booking ID: {params.bookingId}
              </p>
            </div>
          </>
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: GraduationCap,
            label: "Level",
            value: tutoringData?.levelName,
          },
          { icon: Book, label: "Subject", value: tutoringData?.subjectName },
          {
            icon: Calendar,
            label: "Date",
            value: tutoringData?.meetingDate
              ? formatDate(tutoringData.meetingDate)
              : "",
          },
          { icon: Clock, label: "Time", value: tutoringData?.meetingTime },
          {
            icon: RepeatIcon,
            label: "Frequency",
            value: tutoringData?.frequency
              ? capitalizeFirstLetter(tutoringData.frequency)
              : "",
          },
        ].map((item, index) => (
          <div key={index} className="space-y-2">
            {isLoading ? (
              <>
                <div className="h-4 w-[100px] bg-muted animate-pulse rounded" />
                <div className="h-6 w-[150px] bg-muted animate-pulse rounded" />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}:</span>
                </div>
                <p className="text-sm">{item.value}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{`Student's Message`}</h3>
        <ScrollArea className="h-[100px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <p className="text-sm">{tutoringData?.message}</p>
          )}
        </ScrollArea>
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose} disabled={isLoading}>
          {isLoading ? "Loading..." : "Close"}
        </Button>
      </div>
    </div>
  );
}

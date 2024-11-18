"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  GraduationCap,
  Book,
  RepeatIcon,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DateTime } from "luxon";

interface TutoringData {
  createdByName: string;
  levelName: string;
  subjectName: string;
  meetingDate: string;
  meetingTime: string;
  endTime: string;
  status: string;
}

interface TutoringDetailsDialogProps {
  params: {
    bookingId: string;
  };
  onClose: () => void;
  setTitle: (title: string) => void;
}

export default function Component({
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

      const { data, error } = await createClient()
        .from("bookings")
        .select(
          `
          id,
          start_time,
          end_time,
          status,
          metadata->levelId,
          created_by:profiles!bookings_created_by_profile_id_fkey (
            name
          )
        `
        )
        .eq("id", params.bookingId)
        .single<{
          id: number;
          start_time: string;
          end_time: string;
          status: string;
          levelId: number;
          created_by: {
            name: string;
          };
        }>();

      if (error) {
        console.error("Error fetching booking details:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        const levelId = data.levelId;
        let levelName = "N/A";
        let subjectName = "N/A";

        if (levelId) {
          const { data: levelData, error: levelError } = await createClient()
            .from("levels")
            .select(
              `
              id,
              name,
              subjects (name)
            `
            )
            .eq("id", levelId)
            .single<{
              id: number;
              name: string;
              subjects: {
                name: string;
              };
            }>();

          if (levelError) {
            console.error("Error fetching level details:", levelError);
          } else if (levelData) {
            levelName = levelData.name;
            subjectName = levelData.subjects.name || "N/A";
          }
        }

        const startTime = DateTime.fromISO(data.start_time);
        const endTime = DateTime.fromISO(data.end_time);
        const meetingDate = startTime.toLocaleString(DateTime.DATE_MED);
        const meetingTime = startTime.toFormat("h:mm a");
        const endTimeFormatted = endTime.toFormat("h:mm a");

        setTutoringData({
          createdByName: data.created_by?.name || "Unknown User",
          levelName,
          subjectName,
          meetingDate,
          meetingTime,
          endTime: endTimeFormatted,
          status: data.status || "Pending",
        });
      }

      setIsLoading(false);
    };

    fetchTutoringData();
  }, [params.bookingId, setTitle]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "Confirmed":
        return "success";
      case "Pending":
        return "warning";
      case "Canceled":
        return "destructive";
      case "Completed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-7 w-[200px] bg-muted animate-pulse rounded" />
            <div className="h-5 w-[150px] bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Booking ID: {params.bookingId}
            </p>
          </>
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: User,
            label: "Created By",
            value: tutoringData?.createdByName,
          },
          {
            icon: GraduationCap,
            label: "Level",
            value: tutoringData?.levelName,
          },
          { icon: Book, label: "Subject", value: tutoringData?.subjectName },
          { icon: Calendar, label: "Date", value: tutoringData?.meetingDate },
          {
            icon: Clock,
            label: "Time",
            value: `${tutoringData?.meetingTime} - ${tutoringData?.endTime}`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-[100px] bg-muted animate-pulse rounded" />
                  <div className="h-6 w-[150px] bg-muted animate-pulse rounded" />
                </div>
              </>
            ) : (
              <>
                <item.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm">{item.value}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
        {isLoading ? (
          <>
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-[100px] bg-muted animate-pulse rounded" />
              <div className="h-6 w-[150px] bg-muted animate-pulse rounded" />
            </div>
          </>
        ) : (
          <>
            <RepeatIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={getStatusBadgeVariant(tutoringData!.status)}>
                {tutoringData?.status}
              </Badge>
            </div>
          </>
        )}
      </div>
      <Separator />
      <div className="flex justify-end">
        <Button onClick={onClose} variant="default" disabled={isLoading}>
          {isLoading ? "Loading..." : "Close"}
        </Button>
      </div>
    </div>
  );
}

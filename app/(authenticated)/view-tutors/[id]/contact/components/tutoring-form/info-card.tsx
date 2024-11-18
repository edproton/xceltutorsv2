import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { TutorInfo } from "../../types";
import DetailItem from "./detail-item";

interface WatchedFields {
  levelId?: number;
  meetingDate?: Date;
  meetingTime?: string;
  frequency?: string;
}

interface InfoCardProps {
  tutor: TutorInfo;
  watchedFields: WatchedFields;
}

export default function InfoCard({ tutor, watchedFields }: InfoCardProps) {
  const isInfoCardEmpty =
    !watchedFields.levelId &&
    !watchedFields.meetingDate &&
    !watchedFields.meetingTime &&
    !watchedFields.frequency;

  const selectedSubjectAndLevel = (() => {
    if (!watchedFields.levelId) return null;
    for (const subject of tutor.subjects) {
      for (const level of subject.levels) {
        if (level.id === watchedFields.levelId) {
          return { subject: subject.name, level: level.name };
        }
      }
    }
    return null;
  })();

  return (
    <Card className="border bg-card text-card-foreground">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Image
              src={tutor.avatar}
              alt={tutor.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-center mb-6">
              {`Here's what you'd like ${tutor.name} to help you with`}
            </h2>
            {!isInfoCardEmpty && (
              <div className="space-y-4">
                {selectedSubjectAndLevel && (
                  <>
                    <DetailItem
                      icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
                      value={selectedSubjectAndLevel.subject}
                      label="Subject"
                    />
                    <DetailItem
                      icon={
                        <GraduationCap className="h-5 w-5" aria-hidden="true" />
                      }
                      value={selectedSubjectAndLevel.level}
                      label="Level"
                    />
                  </>
                )}
                {watchedFields.meetingDate && watchedFields.meetingTime && (
                  <DetailItem
                    icon={<Calendar className="h-5 w-5" aria-hidden="true" />}
                    value={`${format(
                      watchedFields.meetingDate,
                      "d MMM ''yy"
                    )}, ${watchedFields.meetingTime}`}
                    label="Free meeting request"
                  />
                )}
                {watchedFields.frequency && (
                  <DetailItem
                    icon={<Clock className="h-5 w-5" aria-hidden="true" />}
                    value={
                      watchedFields.frequency === "weekly"
                        ? "Weekly"
                        : watchedFields.frequency === "biweekly"
                        ? "Bi-weekly"
                        : watchedFields.frequency === "monthly"
                        ? "Monthly"
                        : "Undecided"
                    }
                    label="Frequency"
                  />
                )}
              </div>
            )}
            {isInfoCardEmpty && (
              <div className="text-center space-y-4">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Fill out the form to see a summary of your tutoring request
                  here. This will help {tutor.name} understand your needs
                  better.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { BookCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tutor } from "../tutors-repository";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorCardProps {
  tutor: Tutor;
}

const tagColorMap: Record<string, string> = {
  "Responds quickly": "bg-green-500 hover:bg-green-600",
  "Super tutor": "bg-cyan-500 hover:bg-cyan-600",
};

export default function Component({
  tutor: {
    id,
    name,
    avatar,
    metadata: {
      bio: { short },
      completedLessons,
      reviews,
      tags,
      degree,
      university,
    },
  },
}: TutorCardProps) {
  return (
    <Link href={`/view-tutors/${id}`}>
      <Card className="group w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-1/4 min-w-[100px] max-w-[120px]">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage
                  src={avatar}
                  alt={`Tutor ${name}`}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-none">
                  <Skeleton className="h-full w-full" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {name}
                  </h3>
                  <p className="text-sm text-muted-foreground/80">
                    {university} - {degree}
                  </p>
                </div>
                {tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${
                          tagColorMap[tag] ||
                          "bg-secondary hover:bg-secondary/80"
                        } text-secondary-foreground text-xs px-1.5 py-0.5`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                  {short}
                </p>
              </div>
              {(reviews > 0 || completedLessons > 0) && (
                <div className="mt-4 flex items-center text-center gap-4 text-xs">
                  {reviews > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-muted-foreground">
                        {reviews} reviews
                      </span>
                    </div>
                  )}
                  {completedLessons > 0 && (
                    <div className="flex items-center  gap-1">
                      <BookCheck className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">
                        {completedLessons} lessons
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

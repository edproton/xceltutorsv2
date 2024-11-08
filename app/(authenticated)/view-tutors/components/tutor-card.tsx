import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tutor } from "../tutors-repository";
import Link from "next/link";

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
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-1/4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
              <Avatar className="h-48 w-full rounded-none sm:h-full">
                <AvatarImage
                  src={avatar}
                  alt={`Tutor ${name}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-base text-muted-foreground/80">
                    {university} - {degree}
                  </p>
                </div>
                {tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${
                          tagColorMap[tag] ||
                          "bg-secondary hover:bg-secondary/80"
                        } text-secondary-foreground`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {short}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-muted-foreground">
                    {reviews} reviews
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {completedLessons} lessons
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

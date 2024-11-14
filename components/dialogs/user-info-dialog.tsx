"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface UserInfoDialogProps {
  params: {
    userId: string;
    content: string;
  };
  onClose: () => void;
  setTitle: (title: string) => void;
}

export default function UserInfoDialog({
  params,
  onClose,
  setTitle,
}: UserInfoDialogProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTitle("User Information");

    const fetchUserData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 5000));
      // Mock user data
      const mockData: UserData = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.jpg",
      };
      setUserData(mockData);
      setIsLoading(false);
    };

    fetchUserData();
  }, [setTitle]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full">
          {!isLoading && (
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData?.avatar} alt={userData?.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          )}
        </Skeleton>
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]">
            {!isLoading && (
              <h2 className="text-2xl font-bold">
                {userData?.name || "Unknown User"}
              </h2>
            )}
          </Skeleton>
          <Skeleton className="h-4 w-[150px]">
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                User ID: {params.userId}
              </p>
            )}
          </Skeleton>
          <Skeleton className="h-4 w-[200px]">
            {!isLoading && userData?.email && (
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            )}
          </Skeleton>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">User Content</h3>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm">{params.content}</p>
          )}
        </ScrollArea>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            User ID: <span className="font-medium">{params.userId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Content length:{" "}
            <span className="font-medium">
              {params.content.length} characters
            </span>
          </p>
        </div>
        <Button onClick={onClose} disabled={isLoading}>
          {isLoading ? "Loading..." : "Close"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus } from "lucide-react";
import { useInView } from "react-intersection-observer";

const supabase = createClient();

type Profile = {
  id: string;
  name: string;
  avatar: string;
};

interface ProfileListProps {
  currentUserId: string;
  onSelectProfile: (profile: Profile) => void;
  existingProfileIds: string[];
}

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function ProfileList({
  currentUserId,
  onSelectProfile,
  existingProfileIds,
}: ProfileListProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchProfiles = useCallback(
    async (searchQuery = "", reset = false) => {
      if (isLoading || (!hasMore && !reset)) return;
      if (!isValidUUID(currentUserId)) {
        setError("Invalid user ID. Please try logging in again.");
        return;
      }

      setIsLoading(true);
      setError(null);
      const limit = 10;
      const currentPage = reset ? 0 : page;

      try {
        let query = supabase
          .from("profiles")
          .select("id, name, avatar")
          .neq("id", currentUserId);

        const validExistingIds = existingProfileIds.filter((id) =>
          isValidUUID(id)
        );
        if (validExistingIds.length > 0) {
          query = query.not("id", "in", `(${validExistingIds.join(",")})`);
        }

        query = query
          .range(currentPage * limit, (currentPage + 1) * limit - 1)
          .order("name", { ascending: true });

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProfiles((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === limit);
        setPage(currentPage + 1);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to fetch profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentUserId, existingProfileIds, hasMore, isLoading, page]
  );

  useEffect(() => {
    if (isValidUUID(currentUserId)) {
      fetchProfiles();
    }
  }, [fetchProfiles, currentUserId]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchProfiles();
    }
  }, [inView, hasMore, fetchProfiles]);

  const handleSearch = () => {
    fetchProfiles(searchQuery, true);
    setIsSearchOpen(false);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-semibold">New Chat</h2>
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Profiles</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {profiles.map((profile, index) => (
            <button
              key={`${profile.id}-${index}`}
              onClick={() => onSelectProfile(profile)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Avatar>
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium">{profile.name}</div>
              </div>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          {hasMore && (
            <div
              ref={ref}
              className="py-4 text-center text-sm text-muted-foreground"
            >
              {isLoading ? "Loading more profiles..." : "Load more profiles"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

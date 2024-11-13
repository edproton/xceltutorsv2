"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Profile } from "../../types";
import useDebounce from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onSelectProfile: (profile: Profile) => void;
}

const supabase = createClient();

export default function NewChatModal({
  isOpen,
  onClose,
  currentUserId,
  onSelectProfile,
}: NewChatModalProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProfiles = useCallback(
    async (search = "") => {
      if (!currentUserId) return;

      try {
        let query = supabase
          .from("profiles")
          .select("id, name, avatar")
          .neq("id", currentUserId);

        if (search) {
          query = query.ilike("name", `%${search}%`);
        }

        // Subquery to get existing conversation partner IDs
        const { data: existingPartners, error: subqueryError } = await supabase
          .from("conversations")
          .select("from_profile_id, to_profile_id")
          .or(
            `from_profile_id.eq.${currentUserId},to_profile_id.eq.${currentUserId}`
          );

        if (subqueryError) throw subqueryError;

        // Extract unique partner IDs
        const existingPartnerIds = new Set(
          existingPartners
            ?.flatMap((conv) => [conv.from_profile_id, conv.to_profile_id])
            .filter((id) => id !== currentUserId)
        );

        // Exclude existing partners from the main query
        if (existingPartnerIds.size > 0) {
          query = query.not(
            "id",
            "in",
            `(${Array.from(existingPartnerIds).join(",")})`
          );
        }

        const { data, error } = await query
          .order("name", { ascending: true })
          .limit(5);

        if (error) throw error;

        if (data) {
          setProfiles(data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    },
    [currentUserId]
  );

  const debouncedSearch = useDebounce(fetchProfiles, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setProfiles([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col gap-0 p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>New Chat</DialogTitle>
          </div>
          <div className="mt-2 relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </DialogHeader>
        <div className="flex-1 p-4 relative">
          {!searchQuery ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
              <p className="text-lg mb-2">👋 Welcome to your chat space!</p>
              <p className="text-sm">
                {`🔍 Search for your tutor or classmate by name to start a new
                conversation.`}
              </p>
              <p className="text-sm mt-2">
                {`💡 Tip: Try searching for a partial name if you're not sure of
                the full spelling.`}
              </p>
            </div>
          ) : profiles.length > 0 ? (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onSelectProfile(profile);
                    onClose();
                  }}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar>
                    {profile.avatar ? (
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                    ) : (
                      <AvatarFallback>
                        {profile.name[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{profile.name}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {`No profiles found for "${searchQuery}"`}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

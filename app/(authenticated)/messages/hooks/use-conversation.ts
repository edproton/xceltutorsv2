import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function useConversation(currentUserId: string) {
  const fetchConversation = useCallback(
    async (conversationId: number) => {
      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .select(
            `
          *,
          profile:profiles!conversations_to_profile_id_fkey (
            id,
            name,
            avatar
          ),
          from_profile:profiles!conversations_from_profile_id_fkey (
            id,
            name,
            avatar
          )
        `
          )
          .eq("id", conversationId)
          .single();

      if (conversationError) {
        console.error("Error fetching conversation:", conversationError);
        return null;
      }

      // Determine which profile is the other person
      const otherProfile =
        conversationData.from_profile.id === currentUserId
          ? conversationData.profile
          : conversationData.from_profile;

      return {
        ...conversationData,
        profile: otherProfile,
      };
    },
    [currentUserId]
  );

  return { fetchConversation };
}

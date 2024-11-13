import { useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function useConversation() {
  const fetchConversation = useCallback(async (conversationId: number) => {
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
          )
        `
        )
        .eq("id", conversationId)
        .single();

    if (conversationError) {
      console.error("Error fetching conversation:", conversationError);
      return null;
    }

    return conversationData;
  }, []);

  return { fetchConversation };
}
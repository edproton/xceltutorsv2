"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Profile } from "../../types";
import ConversationItem from "./conversation-item";

const supabase = createClient();

export type Conversation = {
  id: number;
  from_profile_id: string;
  to_profile_id: string;
  last_message: string;
  last_message_at: string;
  unread_count: { count: number }[];
  profile: Profile;
};

type ConversationsProps = {
  currentUserId: string;
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
};

export default function Conversations({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
}: ConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        profile:profiles!conversations_to_profile_id_fkey (
          id,
          name,
          avatar
        ),
        unread_count:messages(count)
      `
      )
      .or(
        `from_profile_id.eq.${currentUserId},to_profile_id.eq.${currentUserId}`
      )
      .eq("messages.is_read", false)
      .neq("messages.from_profile_id", currentUserId)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else if (data) {
      setConversations(
        data.map((conv) => ({
          ...conv,
          profile: conv.profile as Profile,
          unread_count: conv.unread_count as { count: number }[],
        }))
      );
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations();

    const channel = supabase
      .channel("conversations_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `from_profile_id=eq.${currentUserId}`,
        },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `from_profile_id=neq.${currentUserId}`,
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return (
    <div className="w-80 border-r bg-muted/50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onSelect={() => onSelectConversation(conversation.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

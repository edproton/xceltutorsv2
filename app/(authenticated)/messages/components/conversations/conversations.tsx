"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "../../types";
import ConversationItem from "./conversation-item";
import { MessageContent } from "@/lib/types";

const supabase = createClient();

export type Conversation = {
  id: number;
  from_profile_id: string;
  to_profile_id: string;
  last_message: MessageContent[];
  last_message_at: string;
  unread_count: number;
  other_user: Profile;
};

type ConversationsProps = {
  currentUserId: string;
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
};

export default function Conversations({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        from_profile:profiles!conversations_from_profile_id_fkey (
          id,
          name,
          avatar
        ),
        to_profile:profiles!conversations_to_profile_id_fkey (
          id,
          name,
          avatar
        ),
        messages!inner (
          id,
          sender_profile_id,
          is_read,
          content
        )
      `
      )
      .or(
        `from_profile_id.eq.${currentUserId},to_profile_id.eq.${currentUserId}`
      )
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else if (data) {
      const processedConversations = data.map((conv) => {
        const otherUser =
          conv.from_profile_id === currentUserId
            ? conv.to_profile
            : conv.from_profile;

        // Calculate unread count
        const unreadCount = conv.messages.filter(
          (msg: { is_read: boolean; sender_profile_id: string }) =>
            !msg.is_read &&
            msg.sender_profile_id !== currentUserId &&
            ((conv.from_profile_id === currentUserId &&
              msg.sender_profile_id === conv.to_profile_id) ||
              (conv.to_profile_id === currentUserId &&
                msg.sender_profile_id === conv.from_profile_id))
        ).length;

        // Determine the last message preview
        const lastMessageContent =
          conv.messages[conv.messages.length - 1]?.content || [];
        const lastMessagePreview =
          lastMessageContent[0]?.type === "text"
            ? lastMessageContent[0].text
            : lastMessageContent[0]?.type === "card"
            ? lastMessageContent[0].title
            : "No messages yet";

        return {
          ...conv,
          other_user: otherUser,
          unread_count: unreadCount,
          last_message: lastMessageContent,
          last_message_preview: lastMessagePreview,
        };
      });
      setConversations(processedConversations);
    }
  }, [currentUserId]);

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
        },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchConversations]);

  return (
    <div className="w-60 border-r bg-muted/50 flex flex-col">
      <div className="border-b h-[60px] px-4 flex justify-between items-center">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onSelect={() => onSelectConversation(conversation.id)}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

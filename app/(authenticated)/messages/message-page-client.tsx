"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ChatBox from "./chat-box";
import { ConversationWithUnreadCount, Profile, Message } from "./types";

interface MessagePageClientProps {
  initialConversations: ConversationWithUnreadCount[];
  initialProfiles: Profile[];
  currentUser: Profile;
}

export default function MessagePageClient({
  initialConversations,
  initialProfiles,
  currentUser,
}: MessagePageClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [profiles] = useState(initialProfiles);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(
    initialConversations.reduce((sum, conv) => sum + conv.unread_count, 0)
  );

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("realtime-messages")
      .on<Message>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => handleNewMessage(payload.new)
      )
      .on<Message>(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) =>
          handleUpdatedMessage(payload.new as Message, payload.old as Message)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewMessage = (newMessage: Message) => {
    if (newMessage.from_profile_id !== currentUser.id) {
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) => {
          if (conv.id === newMessage.conversation_id) {
            return {
              ...conv,
              unread_count: conv.unread_count + 1,
              unread_message_ids: [
                ...(conv.unread_message_ids || []),
                newMessage.id,
              ],
            };
          }
          return conv;
        });
        return updatedConversations;
      });
      setTotalUnreadMessages((prev) => prev + 1);
    }
  };

  const handleUpdatedMessage = (
    updatedMessage: Message,
    oldMessage: Message
  ) => {
    if (
      updatedMessage.from_profile_id !== currentUser.id &&
      updatedMessage.is_read &&
      !oldMessage.is_read
    ) {
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) => {
          if (conv.id === updatedMessage.conversation_id) {
            const newUnreadMessageIds = (conv.unread_message_ids || []).filter(
              (id) => id !== updatedMessage.id
            );
            return {
              ...conv,
              unread_count: newUnreadMessageIds.length,
              unread_message_ids: newUnreadMessageIds,
            };
          }
          return conv;
        });
        return updatedConversations;
      });
      setTotalUnreadMessages((prev) => Math.max(0, prev - 1));
    }
  };

  const handleUnreadCountChange = (totalUnreadCount: number) => {
    setTotalUnreadMessages(totalUnreadCount);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Messages</h1>
      {totalUnreadMessages > 0 && (
        <div className="mb-6">
          <span className="text-xl font-semibold">
            Total Unread Messages: {totalUnreadMessages}
          </span>
        </div>
      )}
      <ChatBox
        conversations={conversations}
        profiles={profiles}
        currentUser={currentUser}
        onUnreadCountChange={handleUnreadCountChange}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Profile } from "../../types";
import MessageHeader from "./message-header";
import MessageList from "./message-list/message-list";
import MessageInput from "./message-input";
import useMessages from "../../hooks/use-messages";
import useConversation from "../../hooks/use-conversation";

export type Message = {
  id: number;
  content: string;
  from_profile_id: string;
  created_at: string;
  is_read: boolean;
  conversation_id: number;
};

type MessagesProps = {
  currentUserId: string;
  conversationId: number | null;
};

export default function Messages({
  currentUserId,
  conversationId,
}: MessagesProps) {
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);

  const { messages, sendMessage, markMessageAsRead, markAllMessagesAsRead } =
    useMessages(conversationId, currentUserId);

  const { fetchConversation } = useConversation(currentUserId);

  useEffect(() => {
    if (!conversationId) return;

    const loadConversation = async () => {
      const conversationData = await fetchConversation(conversationId);

      console.log(conversationData);
      if (conversationData) {
        setOtherProfile(conversationData.profile as Profile);
      }
      await markAllMessagesAsRead();
    };

    loadConversation();
  }, [conversationId, fetchConversation, markAllMessagesAsRead]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a conversation or start a new chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MessageHeader otherProfile={otherProfile} />
      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          otherPersonName={otherProfile?.name || "Other"}
          onMessageInView={markMessageAsRead}
        />
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}

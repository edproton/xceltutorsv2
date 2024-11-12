"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "../../types";
import MessageHeader from "./message-header";
import MessageList from "./message-list";
import MessageInput from "./message-input";

const supabase = createClient();

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const messageCache = useRef(new Set<number>());

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      } else if (messagesData) {
        setMessages(messagesData || []);
        messageCache.current = new Set(
          messagesData?.map((msg) => msg.id) || []
        );
      }

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
      } else if (conversationData) {
        setOtherProfile(conversationData.profile as Profile);
      }
      // Mark all messages as read when opening the conversation
      await markAllMessagesAsRead();
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            if (!messageCache.current.has(newMessage.id)) {
              messageCache.current.add(newMessage.id);
              setMessages((prev) => [...prev, newMessage]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new as Message;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      messageCache.current.clear();
    };
  }, [conversationId]);

  async function markAllMessagesAsRead() {
    if (!conversationId) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("from_profile_id", currentUserId);

      if (error) {
        console.error("Error marking all messages as read:", error);
      } else {
        setMessages((prev) => prev.map((msg) => ({ ...msg, is_read: true })));
        messageCache.current.clear();
      }
    } catch (error) {
      console.error("Error marking all messages as read:", error);
    }
  }

  async function handleSendMessage(content: string) {
    if (!conversationId || !content.trim()) return;

    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          from_profile_id: currentUserId,
          content: content.trim(),
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (message) {
        if (!messageCache.current.has(message.id)) {
          messageCache.current.add(message.id);
          setMessages((prev) => [...prev, message]);
        }

        await supabase
          .from("conversations")
          .update({
            last_message: content.trim(),
            last_message_at: new Date().toISOString(),
          })
          .eq("id", conversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async function markMessageAsRead(messageId: number) {
    if (!messageCache.current.has(messageId)) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId)
        .neq("from_profile_id", currentUserId);

      if (error) {
        console.error("Error marking message as read:", error);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
        messageCache.current.delete(messageId);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }

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
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

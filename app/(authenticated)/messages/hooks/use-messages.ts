import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message, MessageContent } from "../types";

const supabase = createClient();

export default function useMessages(
  conversationId: number | null,
  currentUserId: string
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageCache = useRef(new Set<number>());

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(
          "id, conversation_id, from_profile_id, content, created_at, is_read, visible_to"
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      } else if (messagesData) {
        setMessages(messagesData);
        messageCache.current = new Set(messagesData.map((msg) => msg.id));
      }
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
          const newMessage = payload.new as Message;

          if (
            payload.eventType === "INSERT" &&
            !messageCache.current.has(newMessage.id)
          ) {
            messageCache.current.add(newMessage.id);
            setMessages((prev) => [...prev, newMessage]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === newMessage.id ? newMessage : msg))
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

  const sendMessage = useCallback(
    async (contentArray: MessageContent[]) => {
      if (!conversationId || contentArray.length === 0) return;

      try {
        const { data: message, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            from_profile_id: currentUserId,
            content: contentArray,
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

          // Update the conversation with a preview of the last message
          const lastMessagePreview = contentArray
            .map((item) =>
              item.type === "text" ? item.text : `[Card: ${item.title}]`
            )
            .join(" ");

          await supabase
            .from("conversations")
            .update({
              last_message: lastMessagePreview,
              last_message_at: new Date().toISOString(),
            })
            .eq("id", conversationId);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [conversationId, currentUserId]
  );

  const markMessageAsRead = useCallback(
    async (messageId: number) => {
      if (!messageCache.current.has(messageId)) return;

      try {
        const messageToUpdate = messages.find((msg) => msg.id === messageId);

        if (
          messageToUpdate &&
          messageToUpdate.from_profile_id !== currentUserId &&
          !messageToUpdate.is_read
        ) {
          const { data, error } = await supabase
            .from("messages")
            .update({ is_read: true })
            .eq("id", messageId)
            .select()
            .single();

          if (error) {
            console.error("Error marking message as read:", error);
          } else if (data) {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === messageId ? data : msg))
            );
            messageCache.current.delete(messageId);
          }
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    },
    [messages, currentUserId]
  );

  const markAllMessagesAsRead = useCallback(async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("from_profile_id", currentUserId)
        .select();

      if (error) {
        console.error("Error marking all messages as read:", error);
      } else if (data) {
        setMessages((prev) =>
          prev.map((msg) => {
            const updatedMsg = data.find((m) => m.id === msg.id);
            return updatedMsg ? updatedMsg : msg;
          })
        );
        messageCache.current.clear();
      }
    } catch (error) {
      console.error("Error marking all messages as read:", error);
    }
  }, [conversationId, currentUserId]);

  return {
    messages,
    sendMessage,
    markMessageAsRead,
    markAllMessagesAsRead,
  };
}

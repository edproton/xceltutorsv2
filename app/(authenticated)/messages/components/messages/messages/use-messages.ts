import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Message } from '../messages';

const supabase = createClient();

export default function useMessages(conversationId: number | null, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageCache = useRef(new Set<number>());

  console.log("from setMessages");
    // console.log(messages[72]);
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

        console.log("from messageData");
        // console.log(messagesData[72]); // the is_read is false
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      } else if (messagesData) {
        setMessages(messagesData || []);
        messageCache.current = new Set(
          messagesData?.map((msg) => msg.id) || []
        );
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

  const sendMessage = useCallback(async (content: string) => {
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
  }, [conversationId, currentUserId]);

  const markMessageAsRead = useCallback(async (messageId: number) => {
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
  }, [currentUserId]);

  const markAllMessagesAsRead = useCallback(async () => {
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
  }, [conversationId, currentUserId]);

  return {
    messages,
    sendMessage,
    markMessageAsRead,
    markAllMessagesAsRead
  };
}
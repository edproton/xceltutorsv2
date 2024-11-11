"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ChatUI from "./chat-ui";
import { useToast } from "@/hooks/use-toast";
import { ConversationWithProfiles, Message } from "./types";

type ChatButtonProps = {
  existingConversation: ConversationWithProfiles | undefined;
  profileId: string;
  currentUserId: string;
  currentUserName: string;
  profileName: string;
};

export default function ChatButton({
  existingConversation,
  profileId,
  currentUserId,
  currentUserName,
  profileName,
}: ChatButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(
    existingConversation?.id || null
  );
  const supabase = createClient();
  const { toast } = useToast();

  const fetchMessages = useCallback(
    async (convId: number) => {
      const { data: fetchedMessages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return fetchedMessages || [];
    },
    [supabase]
  );

  const createNewConversation = useCallback(async () => {
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        from_profile_id: currentUserId,
        to_profile_id: profileId,
        last_message: null,
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return newConversation.id;
  }, [supabase, currentUserId, profileId]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupChat = async () => {
      if (!isChatOpen) return;

      setIsLoading(true);
      try {
        let convId = conversationId;
        if (existingConversation) {
          const fetchedMessages = await fetchMessages(existingConversation.id);
          setMessages(fetchedMessages);
          convId = existingConversation.id;
        } else if (!convId) {
          convId = await createNewConversation();
        }

        setConversationId(convId);

        channel = supabase
          .channel(`conversation:${convId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${convId}`,
            },
            (payload) => {
              setMessages((prevMessages) => [
                ...prevMessages,
                payload.new as Message,
              ]);
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Error setting up chat:", error);
        toast({
          title: "Error",
          description: "Failed to set up chat. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupChat();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [
    isChatOpen,
    existingConversation,
    conversationId,
    supabase,
    fetchMessages,
    createNewConversation,
    toast,
  ]);

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setMessages([]);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!conversationId) return;

    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      from_profile_id: currentUserId,
      content: messageText,
      is_read: false,
    });

    if (messageError) {
      console.error("Error sending message:", messageError);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Update the conversation's last_message
    const { error: conversationError } = await supabase
      .from("conversations")
      .update({
        last_message: messageText,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (conversationError) {
      console.error("Error updating conversation:", conversationError);
    }
  };

  return (
    <>
      <Button
        className="w-full"
        variant={existingConversation ? "outline" : "default"}
        onClick={handleChatClick}
        disabled={isLoading}
      >
        {existingConversation ? (
          <>
            <MessageCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "Continue Chat"}
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Start Chat"}
          </>
        )}
      </Button>
      {isChatOpen && (
        <ChatUI
          messages={messages}
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          profileName={profileName}
        />
      )}
    </>
  );
}

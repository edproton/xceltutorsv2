"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "../../types";
import Conversations from "../conversations/conversations";
import NewChatModal from "../conversations/new-chat-modal";
import Messages from "./messages";

const supabase = createClient();

export default function MessagingApp() {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  const startNewConversation = async (profile: Profile) => {
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        from_profile_id: currentUserId,
        to_profile_id: profile.id,
      })
      .select()
      .single();

    if (newConversation && !error) {
      setSelectedConversationId(newConversation.id);
      setIsNewChatOpen(false);
    }
  };

  return (
    <div className="flex h-[600px] max-w-4xl mx-auto border rounded-lg overflow-hidden">
      <Conversations
        currentUserId={currentUserId}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        onNewChat={() => setIsNewChatOpen(true)}
      />
      <div className="flex-1 flex flex-col relative">
        <Messages
          currentUserId={currentUserId}
          conversationId={selectedConversationId}
        />
      </div>
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        currentUserId={currentUserId}
        onSelectProfile={startNewConversation}
      />
    </div>
  );
}

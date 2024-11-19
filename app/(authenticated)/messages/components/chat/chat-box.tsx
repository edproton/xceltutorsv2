"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Conversations from "../conversations/conversations";
import Messages from "./messages";

const supabase = createClient();

export default function MessagingApp() {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
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

  return (
    <div className="flex h-[700px] max-w-screen-2xl mx-auto border rounded-lg overflow-hidden">
      <Conversations
        currentUserId={currentUserId}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      <div className="flex-1 flex flex-col relative">
        <Messages
          currentUserId={currentUserId}
          conversationId={selectedConversationId}
        />
      </div>
    </div>
  );
}

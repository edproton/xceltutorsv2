"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "../../types";
import Conversations from "../conversations/conversations";
import NewChatModal from "../conversations/new-chat-modal";
import Messages from "./messages";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const supabase = createClient();

export default function MessagingApp() {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] max-w-6xl mx-auto border rounded-lg overflow-hidden bg-background">
      <div className="flex-grow flex">
        <div
          className={`md:w-80 border-r bg-muted/50 flex-shrink-0 ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Conversations
            currentUserId={currentUserId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setIsMobileMenuOpen(false);
            }}
            onNewChat={() => setIsNewChatOpen(true)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-xl font-semibold">XcelTutors Chat</h1>
          </div>
          <Messages
            currentUserId={currentUserId}
            conversationId={selectedConversationId}
          />
        </div>
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

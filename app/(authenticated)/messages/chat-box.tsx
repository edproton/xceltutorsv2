"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, Paperclip, Smile, Send, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface Profile {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: number;
  conversation_id: number;
  from_profile_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ConversationWithUnreadCount {
  id: number;
  from_profile: Profile;
  to_profile: Profile;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface ChatBoxProps {
  conversations: ConversationWithUnreadCount[];
  profiles: Profile[];
  currentUser: Profile;
  onUnreadCountChange: (totalUnreadCount: number) => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChatBox({
  conversations: initialConversations,
  profiles: initialProfiles,
  currentUser,
  onUnreadCountChange,
}: ChatBoxProps) {
  const [conversations, setConversations] =
    React.useState<ConversationWithUnreadCount[]>(initialConversations);
  const [profiles] = React.useState<Profile[]>(initialProfiles);
  const [selectedConversation, setSelectedConversation] = React.useState<
    number | null
  >(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newChatSearchTerm, setNewChatSearchTerm] = React.useState("");
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = React.useState(false);
  const [userStatuses, setUserStatuses] = React.useState<
    Record<string, string>
  >({});

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messageRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>(
    {}
  );

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const markMessageAsRead = async (messageId: number) => {
    const message = messages.find((m) => m.id === messageId);
    if (
      message &&
      !message.is_read &&
      message.from_profile_id !== currentUser.id
    ) {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (!error) {
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === message.conversation_id
              ? { ...conv, unread_count: Math.max(0, conv.unread_count - 1) }
              : conv
          )
        );
        const newTotalUnreadCount = conversations.reduce(
          (sum, conv) =>
            sum +
            (conv.id === message.conversation_id
              ? Math.max(0, conv.unread_count - 1)
              : conv.unread_count),
          0
        );
        onUnreadCountChange(newTotalUnreadCount);
      }
    }
  };

  React.useEffect(() => {
    const channel = supabase.channel("realtime-chat", {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const newUserStatuses: Record<string, string> = {};
        Object.keys(newState).forEach((userId) => {
          newUserStatuses[userId] = "Online";
        });
        setUserStatuses(newUserStatuses);
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((currentMessages) => [...currentMessages, newMessage]);
          if (newMessage.from_profile_id !== currentUser.id) {
            setConversations((prevConversations) =>
              prevConversations.map((conv) =>
                conv.id === newMessage.conversation_id
                  ? { ...conv, unread_count: conv.unread_count + 1 }
                  : conv
              )
            );
            if (selectedConversation === newMessage.conversation_id) {
              setTimeout(() => {
                const ref = messageRefs.current[newMessage.id];
                if (ref && isElementInViewport(ref)) {
                  markMessageAsRead(newMessage.id);
                }
              }, 100);
            }
          }
          scrollToBottom();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages((currentMessages) =>
            currentMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, scrollToBottom, selectedConversation]);

  React.useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", selectedConversation)
          .order("created_at", { ascending: true });

        if (!error && data) {
          setMessages(data);
          const unreadMessages = data.filter(
            (msg) => !msg.is_read && msg.from_profile_id !== currentUser.id
          );
          unreadMessages.forEach((msg) => {
            const ref = messageRefs.current[msg.id];
            if (ref && isElementInViewport(ref)) {
              markMessageAsRead(msg.id);
            }
          });
          scrollToBottom();
        } else {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation, scrollToBottom]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.id.split("-")[1]);
            const message = messages.find((m) => m.id === messageId);
            if (
              message &&
              !message.is_read &&
              message.from_profile_id !== currentUser.id
            ) {
              markMessageAsRead(messageId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(messageRefs.current).forEach((ref) => {
      if (ref) observer.unobserve(ref);
    });

    Object.values(messageRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [messages, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      try {
        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            conversation_id: selectedConversation,
            from_profile_id: currentUser.id,
            content: newMessage,
            is_read: false,
          })
          .select()
          .single();

        if (messageError) throw messageError;

        const { error: conversationError } = await supabase
          .from("conversations")
          .update({
            last_message: newMessage,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", selectedConversation);

        if (conversationError) throw conversationError;

        setNewMessage("");
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const startNewConversation = async (profile: Profile) => {
    try {
      const { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select(
          "*, from_profile:from_profile_id(*), to_profile:to_profile_id(*)"
        )
        .or(
          `and(from_profile_id.eq.${currentUser.id},to_profile_id.eq.${profile.id}),and(from_profile_id.eq.${profile.id},to_profile_id.eq.${currentUser.id})`
        )
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingConversation) {
        setSelectedConversation(existingConversation.id);
        setIsNewChatDialogOpen(false);
        return;
      }

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .insert({
            from_profile_id: currentUser.id,
            to_profile_id: profile.id,
            last_message: "",
            last_message_at: new Date().toISOString(),
          })
          .select(
            "*, from_profile:from_profile_id(*), to_profile:to_profile_id(*)"
          )
          .single();

      if (conversationError) throw conversationError;

      if (
        !conversationData ||
        !conversationData.from_profile ||
        !conversationData.to_profile
      ) {
        throw new Error("Failed to create conversation with complete data");
      }

      const newConversation: ConversationWithUnreadCount = {
        ...conversationData,
        from_profile: conversationData.from_profile as Profile,
        to_profile: conversationData.to_profile as Profile,
        unread_count: 0,
      };

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation.id);
      setIsNewChatDialogOpen(false);
    } catch (error) {
      console.error("Error creating or getting conversation:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex overflow-hidden">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog
            open={isNewChatDialogOpen}
            onOpenChange={setIsNewChatDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New chat</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start a new conversation</DialogTitle>
              </DialogHeader>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users"
                  className="pl-8"
                  value={newChatSearchTerm}
                  onChange={(e) => setNewChatSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[300px] pr-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                    onClick={() => startNewConversation(profile)}
                  >
                    <Avatar>
                      {profile.avatar && profile.avatar !== "" ? (
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                      ) : (
                        <AvatarFallback>
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{profile.name}</p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userStatuses[profile.id]
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span>
                          {userStatuses[profile.id] ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conversation) => {
            const otherProfileId =
              conversation.from_profile.id === currentUser.id
                ? conversation.to_profile.id
                : conversation.from_profile.id;
            const otherProfile = profiles.find(
              (p) => p.id === otherProfileId
            ) || { id: otherProfileId, name: "Unknown", avatar: "" };

            return (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedConversation === conversation.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={otherProfile.avatar}
                      alt={otherProfile.name}
                    />
                    <AvatarFallback>
                      {otherProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-semibold truncate">
                        {otherProfile.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userStatuses[otherProfile.id]
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span>
                          {userStatuses[otherProfile.id] ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conversation.last_message || "No messages yet"}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="rounded-full">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedConversation && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-4">
              {(() => {
                const conversation = conversations.find(
                  (c) => c.id === selectedConversation
                );
                const otherProfileId =
                  conversation?.from_profile.id === currentUser.id
                    ? conversation.to_profile.id
                    : conversation?.from_profile.id;
                const otherProfile = profiles.find(
                  (p) => p.id === otherProfileId
                ) || { id: otherProfileId || "", name: "Unknown", avatar: "" };

                return (
                  <>
                    <Avatar>
                      <AvatarImage
                        src={otherProfile.avatar}
                        alt={otherProfile.name}
                      />
                      <AvatarFallback>
                        {otherProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {otherProfile.name}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userStatuses[otherProfile.id]
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <p className="text-sm text-muted-foreground">
                          {userStatuses[otherProfile.id] ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  id={`message-${message.id}`}
                  ref={(el) => {
                    messageRefs.current[message.id] = el;
                  }}
                  className={`flex mb-4 ${
                    message.from_profile_id === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.from_profile_id === currentUser.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </>
        )}
        {!selectedConversation && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg text-muted-foreground text-center">
              Select a conversation to start chatting 💬
              <br />
              <span className="text-sm">Your messages will appear here</span>
            </p>
          </div>
        )}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={!selectedConversation}
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Input
              placeholder="Type a message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!selectedConversation}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={!selectedConversation}
            >
              <Smile className="h-5 w-5" />
              <span className="sr-only">Insert emoji</span>
            </Button>
            <Button type="submit" size="icon" disabled={!selectedConversation}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}

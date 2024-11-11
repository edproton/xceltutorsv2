"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Send } from "lucide-react";
import { Message } from "./types";

type ChatUIProps = {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  currentUserId: string;
  currentUserName: string;
  profileName: string;
};

export default function ChatUI({
  messages,
  onClose,
  onSendMessage,
  currentUserId,
  currentUserName,
  profileName,
}: ChatUIProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[32rem] flex flex-col shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${profileName}`}
            />
            <AvatarFallback>{profileName[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm font-medium">
            Chat with {profileName}
          </CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[22rem] w-full pr-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from_profile_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              } mb-4`}
            >
              <div className="flex flex-col max-w-[70%]">
                <span className="text-xs text-muted-foreground mb-1">
                  {message.from_profile_id === currentUserId
                    ? currentUserName
                    : profileName}
                </span>
                <div
                  className={`rounded-lg p-2 break-words ${
                    message.from_profile_id === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

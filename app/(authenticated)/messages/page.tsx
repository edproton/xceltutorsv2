"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessagesRepository } from "./messages-repository";

// Define MessageModel type
interface MessageModel {
  id: string;
  message: string;
  expand: {
    from: {
      id: string;
      name: string;
    };
    to: {
      id: string;
      name: string;
    };
  };
  createdAt: Date;
}

// Define TutorModel type
interface TutorModel {
  id: string;
  name: string;
  avatar: string;
  messages: MessageModel[];
}

// Main component
export default function MessagesPage() {
  const [tutors, setTutors] = useState<TutorModel[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<TutorModel | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch initial conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const conversations = await MessagesRepository.getConversations();
      const formattedTutors: TutorModel[] = conversations.map((conv) => ({
        id: conv.toId,
        name: conv.toName,
        avatar: `/placeholder.svg?height=40&width=40`, // Replace with real avatar if available
        messages: conv.messages.map((msg) => ({
          id: msg.id,
          message: msg.message,
          expand: {
            from: {
              id: msg.fromId,
              name: msg.fromName,
            },
            to: {
              id: msg.toId,
              name: msg.toName,
            },
          },
          createdAt: new Date(msg.createdAt),
        })),
      }));
      setTutors(formattedTutors);

      // Set the first tutor as selected by default
      if (formattedTutors.length > 0) {
        handleSelectTutor(formattedTutors[0]);
      }
    };

    fetchConversations();
  }, []);

  // Subscribe to real-time messages for the selected tutor
  useEffect(() => {
    if (!selectedTutor) return;

    MessagesRepository.subscribeToMessages((data) => {
      const newMessage = data.record as unknown as MessageModel;
      if (newMessage.expand.to.id === selectedTutor.id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Cleanup subscription on unmount or when selectedTutor changes
    return () => {
      MessagesRepository.unsubscribeFromMessages();
    };
  }, [selectedTutor]);

  // Handle selecting a tutor
  const handleSelectTutor = (tutor: TutorModel) => {
    setSelectedTutor(tutor);
    setMessages(tutor.messages || []);
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedTutor) return;

    await MessagesRepository.createMessage(newMessage, selectedTutor.id);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Messages</h1>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-transparent">
              <TabsTrigger value="active">Active chats</TabsTrigger>
              <TabsTrigger value="students">Students&apos; chats</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-8">
              <div className="flex h-[calc(100vh-200px)] bg-background rounded-lg overflow-hidden border border-border">
                {/* Tutors list */}
                <div className="w-1/4 border-r border-border">
                  <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Tutors</h2>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    {tutors.map((tutor) => (
                      <Button
                        key={tutor.id}
                        variant="ghost"
                        className={`w-full justify-start px-4 py-2 ${
                          selectedTutor?.id === tutor.id ? "bg-accent" : ""
                        }`}
                        onClick={() => handleSelectTutor(tutor)}
                      >
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>
                            {tutor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {tutor.name}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">
                      {selectedTutor?.name || "Select a Tutor"}
                    </h2>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start mb-4 ${
                            message.expand.from.name === "You"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.expand.from.name !== "You" && (
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarImage
                                src={selectedTutor?.avatar}
                                alt={selectedTutor?.name}
                              />
                              <AvatarFallback>
                                {selectedTutor?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 max-w-[70%] ${
                              message.expand.from.name === "You"
                                ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white"
                                : "bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900"
                            }`}
                          >
                            <p>{message.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No messages yet.</p>
                    )}
                  </ScrollArea>
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-border"
                  >
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit">Send</Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

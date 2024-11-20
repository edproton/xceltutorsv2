import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { TextMessage } from "@/lib/types";

type MessageInputProps = {
  onSendMessage: (content: TextMessage[]) => void;
};

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();

    if (trimmedMessage) {
      // Construct the content array with a single text message
      const contentArray: TextMessage[] = [
        {
          type: "text",
          text: trimmedMessage,
        },
      ];

      onSendMessage(contentArray);
      setNewMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex space-x-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}

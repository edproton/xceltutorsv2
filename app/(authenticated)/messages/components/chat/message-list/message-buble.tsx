import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCheck } from "lucide-react";
import { Message } from "../../../types";
import { format } from "date-fns";

type MessageBubbleProps = {
  message: Message;
  isCurrentUser: boolean;
  isFirstInGroup: boolean;
  senderName: string;
};

export default function MessageBubble({
  message,
  isCurrentUser,
  isFirstInGroup,
  senderName,
}: MessageBubbleProps) {
  return (
    <div
      id={`message-${message.id}`}
      className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
    >
      {isFirstInGroup && (
        <span className="text-xs font-medium text-muted-foreground mb-1">
          {senderName}
        </span>
      )}
      <div className="max-w-[75%]">
        {message.content.map((item, index) => (
          <Card
            key={index}
            className={`break-words px-3 py-2 border-0 ${
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            <CardContent className="p-0">
              {item.type === "text" && (
                <p className="text-sm whitespace-pre-wrap">{item.text}</p>
              )}
              {item.type === "card" && (
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <div
          className={`text-xs text-muted-foreground mt-1 flex items-center gap-1 ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatMessageTime(message.created_at)}</span>
          {isCurrentUser &&
            (message.is_read ? (
              <CheckCheck className="h-3 w-3 text-blue-500" aria-label="Read" />
            ) : (
              <Check className="h-3 w-3 text-gray-500" aria-label="Sent" />
            ))}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(timestamp: string) {
  return format(new Date(timestamp), "h:mm a");
}

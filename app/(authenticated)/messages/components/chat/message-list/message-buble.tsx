import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCheck } from "lucide-react";
import { Message } from "../messages";
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
        <Card
          className={`break-words px-3 py-2 border-0 ${
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary"
          }`}
        >
          <CardContent className="p-0">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
        <div
          className={`text-xs text-muted-foreground mt-1 flex items-center gap-1 ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          {!isCurrentUser && (
            <span>{formatMessageTime(message.created_at)}</span>
          )}
          {isCurrentUser && (
            <>
              {message.is_read ? (
                <CheckCheck
                  className="h-3 w-3 text-blue-500"
                  aria-label="Read"
                />
              ) : (
                <Check className="h-3 w-3 text-gray-500" aria-label="Sent" />
              )}
              <span>{formatMessageTime(message.created_at)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(timestamp: string) {
  return format(new Date(timestamp), "h:mm a");
}

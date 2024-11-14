import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CardMessage {
  type: "card";
  title: string;
  description: string;
  imageUrl?: string;
  actions?: {
    classes?: string;
    label: string;
    url?: string;
    callbackName?: string;
  }[];
}

interface TextMessage {
  type: "text";
  text: string;
}

type MessageContent = CardMessage | TextMessage;

interface Message {
  id: string;
  content: MessageContent[];
  created_at: string;
  is_read: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isFirstInGroup: boolean;
  senderName: string;
}

function formatMessageTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({
  message,
  isCurrentUser,
  isFirstInGroup,
  senderName,
}: MessageBubbleProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div
      id={`message-${message.id}`}
      className={`flex flex-col ${
        isCurrentUser ? "items-end" : "items-start"
      } mb-4`}
    >
      {isFirstInGroup && (
        <span className="text-xs font-medium text-muted-foreground mb-1">
          {senderName}
        </span>
      )}
      <div className="max-w-[75%]">
        {message.content.map((item: MessageContent, index) => (
          <Card
            key={`message-content-${index}`}
            className={`mb-2 overflow-hidden ${
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {item.type === "text" ? (
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap">{item.text}</p>
              </CardContent>
            ) : item.type === "card" ? (
              <>
                <CardHeader className="p-4">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  {item.imageUrl && (
                    <div className="flex justify-center items-center h-16 sm:h-24">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "Card image"}
                        width={200}
                        height={80}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    </div>
                  )}
                </CardContent>
                {item.actions && item.actions.length > 0 && (
                  <CardFooter className="p-4 pt-2">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {item.actions.map((action, actionIndex) => {
                        if (!action.url && !action.callbackName) {
                          setError(
                            "Each action must have either a URL or a callback name."
                          );
                          return null;
                        }
                        if (action.url && action.callbackName) {
                          setError(
                            "An action cannot have both a URL and a callback name."
                          );
                          return null;
                        }
                        return (
                          <Button
                            key={`action-${actionIndex}`}
                            className={`text-xs px-2 py-1 rounded ${
                              action.classes || ""
                            } ${
                              actionIndex === 2 && item.actions?.length === 3
                                ? "col-span-2"
                                : ""
                            }`}
                            asChild={!!action.url}
                          >
                            {action.url ? (
                              <Link
                                href={action.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="flex items-center justify-center">
                                  {action.label}
                                  <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                                </span>
                              </Link>
                            ) : (
                              <span className="flex items-center justify-center">
                                {action.label}
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </CardFooter>
                )}
              </>
            ) : null}
          </Card>
        ))}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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

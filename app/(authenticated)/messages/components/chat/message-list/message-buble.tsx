"use client";

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
import { Message, MessageContent } from "../../../types";
import { CallbackDialog } from "./callback-dialog";

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

export const getButtonClasses = (color: string): string => {
  const colorClasses: Record<string, string> = {
    red: "bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800",
    blue: "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800",
    green:
      "bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-800",
    yellow:
      "bg-yellow-500 hover:bg-yellow-600 text-black dark:bg-yellow-700 dark:hover:bg-yellow-800",
    purple:
      "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-700 dark:hover:bg-purple-800",
    gray: "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-700 dark:hover:bg-gray-800",
    pink: "bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-700 dark:hover:bg-pink-800",
    teal: "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-700 dark:hover:bg-teal-800",
    cyan: "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-700 dark:hover:bg-cyan-800",
    lime: "bg-lime-500 hover:bg-lime-600 text-black dark:bg-lime-700 dark:hover:bg-lime-800",
    amber:
      "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-700 dark:hover:bg-amber-800",
    orange:
      "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-700 dark:hover:bg-orange-800",
    default:
      "bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:hover:bg-gray-800",
  };

  return colorClasses[color] || colorClasses["default"];
};

export default function MessageBubble({
  message,
  isCurrentUser,
  isFirstInGroup,
  senderName,
}: MessageBubbleProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCallback, setCurrentCallback] = useState<{
    name: string;
    params: Record<string, string>;
  } | null>(null);

  const handleCallback = (name: string, params: Record<string, string>) => {
    setCurrentCallback({ name, params });
    setIsDialogOpen(true);
  };

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
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
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
                        if (!action.url && !action.callback) {
                          setError(
                            "Each action must have either a URL or a callback name."
                          );
                          return null;
                        }
                        if (action.url && action.callback) {
                          setError(
                            "An action cannot have both a URL and a callback name."
                          );
                          return null;
                        }

                        return (
                          <Button
                            key={`action-${actionIndex}`}
                            className={`text-xs px-2 py-1 rounded ${getButtonClasses(
                              action.color || "default"
                            )} ${
                              item.actions && item.actions.length % 2 === 0
                                ? "col-span-1"
                                : "col-span-2"
                            }`}
                            asChild={!!action.url}
                            onClick={() => {
                              if (action.callback) {
                                handleCallback(
                                  action.callback.name,
                                  action.callback.params
                                );
                              }
                            }}
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
      {currentCallback && (
        <CallbackDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          callbackName={currentCallback.name}
          params={currentCallback.params}
        />
      )}
    </div>
  );
}

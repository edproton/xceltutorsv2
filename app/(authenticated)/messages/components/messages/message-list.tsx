import { memo, useMemo, useEffect, useRef, useState, useCallback } from "react";
import { Check, CheckCheck, ChevronDown } from "lucide-react";
import { Message } from "./messages";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import debounce from "@/lib/helpers/debounce";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  otherPersonName: string;
  onMessageInView: (messageId: number) => void;
};

type GroupedMessage = {
  sender: string;
  messages: Message[];
  date: string;
};

const MessageList = memo(function MessageList({
  messages,
  currentUserId,
  otherPersonName,
  onMessageInView,
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    let lastDate = "";
    return messages.reduce((groups: GroupedMessage[], message) => {
      const date = format(new Date(message.created_at), "MMMM d, yyyy");
      const sender =
        message.from_profile_id === currentUserId ? "You" : otherPersonName;
      const lastGroup = groups[groups.length - 1];

      if (date !== lastDate) {
        lastDate = date;
        groups.push({ sender, messages: [message], date });
      } else if (lastGroup && lastGroup.sender === sender) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ sender, messages: [message], date: "" });
      }

      return groups;
    }, []);
  }, [messages, currentUserId, otherPersonName]);

  const debouncedOnMessageInView = useCallback(
    debounce((...args: unknown[]) => {
      const messageId = args[0] as number;
      onMessageInView(messageId);
    }, 300),
    [onMessageInView]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.id.split("-")[1]);
            debouncedOnMessageInView(messageId);
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [debouncedOnMessageInView]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        const isNearBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 20;
        setShowScrollButton(!isNearBottom);
        setIsScrolledToBottom(isNearBottom);
      };

      scrollContainer.addEventListener("scroll", handleScroll);

      // Initial scroll to bottom
      if (isScrolledToBottom) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }

      // Observe messages for read status
      messages.forEach((message) => {
        const element = document.getElementById(`message-${message.id}`);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [messages, isScrolledToBottom]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (scrollContainer && isScrolledToBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isScrolledToBottom]);

  const scrollToBottom = () => {
    const scrollContainer = scrollAreaRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      setIsScrolledToBottom(true);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 " ref={scrollAreaRef}>
      {groupedMessages.map((group, groupIndex) => (
        <div
          key={`${group.sender}-${group.date}-${groupIndex}`}
          className="space-y-4"
        >
          {group.date && (
            <Card className="bg-muted/50 mx-auto w-fit px-4 py-1">
              <CardContent className="p-0">
                <span className="text-xs font-medium text-muted-foreground">
                  {group.date}
                </span>
              </CardContent>
            </Card>
          )}
          {group.messages.map((message, messageIndex) => {
            const isCurrentUser = message.from_profile_id === currentUserId;
            const isFirstInGroup = messageIndex === 0;

            return (
              <div
                key={`${message.id}-${message.from_profile_id}-${message.created_at}`}
                id={`message-${message.id}`}
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                {isFirstInGroup && (
                  <span className="text-xs font-medium text-muted-foreground mb-1">
                    {group.sender}
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
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
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
                          <Check
                            className="h-3 w-3 text-gray-500"
                            aria-label="Sent"
                          />
                        )}
                        <span>{formatMessageTime(message.created_at)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md mr-4"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

export default MessageList;

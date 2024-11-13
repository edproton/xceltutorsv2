import { memo, useMemo, useEffect, useRef, useCallback } from "react";
import { Message } from "./messages";
import { format } from "date-fns";
import debounce from "@/lib/helpers/debounce";
import MessageGroup from "./message-list/message-group";
import ScrollButton from "./message-list/scroll-button";
import useScrollManagement from "./message-list/use-scroll-management";
import useMessageObserver from "./message-list/use-message-observer";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  otherPersonName: string;
  onMessageInView: (messageId: number) => void;
};

export type GroupedMessage = {
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
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const { showScrollButton, isScrolledToBottom, scrollToBottom } =
    useScrollManagement(scrollAreaRef as React.RefObject<HTMLDivElement>);
  const debouncedOnMessageInView = useCallback(
    debounce((messageId: unknown) => {
      if (typeof messageId === "number") {
        onMessageInView(messageId);
      }
    }, 300),
    [onMessageInView]
  );

  useMessageObserver(messages, debouncedOnMessageInView);

  const groupedMessages = useMemo(
    () => groupMessages(messages, currentUserId, otherPersonName),
    [messages, currentUserId, otherPersonName]
  );

  useEffect(() => {
    if (scrollAreaRef.current && isScrolledToBottom) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isScrolledToBottom]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6" ref={scrollAreaRef}>
      {groupedMessages.map((group, groupIndex) => (
        <MessageGroup
          key={`${group.sender}-${group.date}-${groupIndex}`}
          group={group}
          currentUserId={currentUserId}
        />
      ))}
      {showScrollButton && <ScrollButton onClick={scrollToBottom} />}
    </div>
  );
});

function groupMessages(
  messages: Message[],
  currentUserId: string,
  otherPersonName: string
): GroupedMessage[] {
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
}

export default MessageList;
import { memo, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import MessageGroup from "./message-group";
import useScrollManagement from "../../../hooks/use-scroll-management";
import useMessageObserver from "../../../hooks/use-message-observer";
import ScrollButton from "../scroll-button";
import { Message } from "../../../types";

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

  useMessageObserver(messages, onMessageInView);

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

import { Card, CardContent } from "@/components/ui/card";
import { GroupedMessage } from "./message-list";
import MessageBubble from "./message-buble";

type MessageGroupProps = {
  group: GroupedMessage;
  currentUserId: string;
};

export default function MessageGroup({
  group,
  currentUserId,
}: MessageGroupProps) {
  return (
    <div className="space-y-4">
      {group.date && (
        <Card className="bg-muted/50 mx-auto w-fit px-4 py-1">
          <CardContent className="p-0">
            <span className="text-xs font-medium text-muted-foreground">
              {group.date}
            </span>
          </CardContent>
        </Card>
      )}
      {group.messages.map((message, messageIndex) => (
        <MessageBubble
          key={`${message.id}-${message.sender_profile_id}-${message.created_at}`}
          message={message}
          isCurrentUser={message.sender_profile_id === currentUserId}
          isFirstInGroup={messageIndex === 0}
          senderName={group.sender}
        />
      ))}
    </div>
  );
}

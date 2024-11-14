import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "./conversations";

type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  const otherUser = conversation.other_user;
  const unreadCount = conversation.unread_count;

  return (
    <button
      onClick={onSelect}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors
          ${isSelected ? "bg-muted" : ""}`}
    >
      <Avatar>
        <AvatarImage
          src={otherUser.avatar || undefined}
          alt={otherUser.name || "User"}
        />
        <AvatarFallback>
          <span className="font-medium text-base">
            {(otherUser.name || "U")[0].toUpperCase()}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <div className="font-medium">{otherUser.name || "Unknown User"}</div>
        <div className="text-sm text-muted-foreground truncate">
          {conversation.last_message || "No messages yet"}
        </div>
      </div>
      {unreadCount > 0 && (
        <Badge variant="destructive" className="rounded-full px-2 py-1">
          {unreadCount}
        </Badge>
      )}
    </button>
  );
}

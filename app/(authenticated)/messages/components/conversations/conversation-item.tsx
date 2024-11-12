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
  return (
    <button
      onClick={onSelect}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors
          ${isSelected ? "bg-muted" : ""}`}
    >
      <Avatar>
        <AvatarImage
          src={conversation.profile.avatar || undefined}
          alt={conversation.profile.name}
        />
        <AvatarFallback>
          <span className="font-medium text-base">
            {conversation.profile.name[0].toUpperCase()}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <div className="font-medium">{conversation.profile.name}</div>
        <div className="text-sm text-muted-foreground truncate">
          {conversation.last_message}
        </div>
      </div>
      {conversation.unread_count[0]?.count > 0 && (
        <Badge variant="destructive" className="rounded-full px-2 py-1">
          {conversation.unread_count[0].count}
        </Badge>
      )}
    </button>
  );
}

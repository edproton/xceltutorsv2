"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
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
      className={`flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors relative
          ${isSelected ? "bg-muted" : ""}`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
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
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              layout
              key={unreadCount}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              className="absolute -bottom-1 -right-1"
            >
              <Badge
                variant="destructive"
                className="h-[22px] min-w-[22px] rounded-full px-1.5 flex items-center justify-center bg-[#C75D4F] hover:bg-[#C75D4F] text-[13px] font-medium"
              >
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium text-base truncate">
                {otherUser.name || "Unknown User"}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="start">
              <p>{otherUser.name || "Unknown User"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-sm text-muted-foreground/60 truncate">
          {conversation.last_message || "No messages yet"}
        </div>
      </div>
    </button>
  );
}

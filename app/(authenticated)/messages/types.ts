export type Profile = {
  id: string;
  name: string;
  avatar: string | null;
};

export type ConversationWithUnreadCount = {
  id: number;
  from_profile: Profile;
  to_profile: Profile;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  unread_message_ids: number[];
};

export interface TextMessage {
  type: "text";
  text: string;
}

export interface CardMessage {
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

export type MessageContent = TextMessage | CardMessage;

export interface Message {
  id: number;
  conversation_id: number;
  from_profile_id: string;
  content: MessageContent[];
  created_at: string;
  is_read: boolean;
  visible_to: "from" | "to" | "both";
}

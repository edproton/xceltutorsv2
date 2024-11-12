export type Profile = {
  id: string;
  name: string;
  avatar: string;
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

export type Message = {
  id: number;
  conversation_id: number;
  from_profile_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

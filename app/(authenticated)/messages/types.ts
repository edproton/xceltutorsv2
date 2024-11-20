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

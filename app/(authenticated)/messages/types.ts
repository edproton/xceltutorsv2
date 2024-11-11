export type Profile = {
  id: string;
  name: string;
};

export type ConversationWithProfiles = {
  id: number;
  from_profile: {
    id: string;
    name: string | null;
  };
  to_profile: {
    id: string;
    name: string | null;
  };
  last_message_at: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  from_profile_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

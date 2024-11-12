import { createClient } from "@/lib/supabase/server";
import { ConversationWithUnreadCount, Profile } from "./types";
import MessagePageClient from "./message-page-client";

// Update the type definition to match the actual structure returned by Supabase
type ConversationData = {
  id: number;
  from_profile: Profile | null;
  to_profile: Profile | null;
  last_message: string | null;
  last_message_at: string;
  messages: { id: number; is_read: boolean; from_profile_id: string }[];
};

export default async function MessagePage() {
  const supabase = await createClient();

  // Fetch the current user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {userError?.message || "User not found"}
      </div>
    );
  }

  const currentUser: Profile = {
    id: userData.user.id,
    name: userData.user.user_metadata.full_name || "Unknown",
    avatar: userData.user.user_metadata.avatar_url || "",
  };

  // Fetch conversations
  const { data: conversationsData, error: conversationsError } = await supabase
    .from("conversations")
    .select(
      `
      id,
      from_profile:profiles!conversations_from_profile_id_fkey (id, name, avatar),
      to_profile:profiles!conversations_to_profile_id_fkey (id, name, avatar),
      last_message,
      last_message_at,
      messages!inner (id, is_read, from_profile_id)
    `
    )
    .or(
      `from_profile_id.eq.${currentUser.id},to_profile_id.eq.${currentUser.id}`
    )
    .order("last_message_at", { ascending: false });

  if (conversationsError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {conversationsError.message}
      </div>
    );
  }

  const groupedConversations = new Map<string, ConversationWithUnreadCount>();

  (conversationsData as ConversationData[]).forEach((conversation) => {
    const fromId = conversation.from_profile?.id;
    const toId = conversation.to_profile?.id;

    if (!fromId || !toId) return;

    // Generate a unique key by sorting the IDs (ensures consistent grouping)
    const key = [fromId, toId].sort().join("-");

    // Count unread messages for this conversation
    const unreadCount =
      conversation.messages?.filter(
        (msg) => !msg.is_read && msg.from_profile_id !== currentUser.id
      ).length || 0;

    // Add a new property to track unread message IDs
    const unreadMessageIds =
      conversation.messages
        ?.filter(
          (msg) => !msg.is_read && msg.from_profile_id !== currentUser.id
        )
        .map((msg) => msg.id) || [];

    // Store or update the conversation if it's more recent
    if (
      !groupedConversations.has(key) ||
      groupedConversations.get(key)!.last_message_at <
        conversation.last_message_at
    ) {
      groupedConversations.set(key, {
        id: conversation.id,
        from_profile: conversation.from_profile || {
          id: "",
          name: "Unknown",
          avatar: "",
        },
        to_profile: conversation.to_profile || {
          id: "",
          name: "Unknown",
          avatar: "",
        },
        last_message: conversation.last_message || "",
        last_message_at: conversation.last_message_at,
        unread_count: unreadCount,
        unread_message_ids: unreadMessageIds,
      });
    }
  });

  // Convert the map back to an array
  const uniqueConversations = Array.from(groupedConversations.values());

  // Fetch all profiles for the new chat dialog
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, avatar")
    .neq("id", currentUser.id);

  if (profilesError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {profilesError.message}
      </div>
    );
  }

  // Transform profiles to ensure no null values
  const profiles: Profile[] = (profilesData || []).map((profile) => ({
    id: profile.id,
    name: profile.name || "Unknown",
    avatar: profile.avatar || "",
  }));

  return (
    <MessagePageClient
      initialConversations={uniqueConversations}
      initialProfiles={profiles}
      currentUser={currentUser}
    />
  );
}

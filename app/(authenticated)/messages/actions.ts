"use server";

import { createClient } from "@/lib/supabase/client";

export async function getOrCreateConversation(
  fromProfileId: string,
  toProfileId: string
) {
  const supabase = await createClient();

  // Check if the conversation already exists
  const { data: existingConversation, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`from_profile_id.eq.${fromProfileId},to_profile_id.eq.${toProfileId}`)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error fetching conversation: ${error.message}`);
  }

  if (existingConversation) {
    return existingConversation;
  }

  // Create a new conversation if it doesn't exist
  const { data: newConversation, error: insertError } = await supabase
    .from("conversations")
    .insert([{ from_profile_id: fromProfileId, to_profile_id: toProfileId }])
    .select()
    .single();

  if (insertError) {
    throw new Error(`Error creating conversation: ${insertError.message}`);
  }

  return newConversation;
}

export async function sendMessage(
  conversationId: number,
  fromProfileId: string,
  message: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert([
    {
      conversation_id: conversationId,
      from_profile_id: fromProfileId,
      message,
    },
  ]);

  if (error) {
    throw new Error(`Error sending message: ${error.message}`);
  }

  await supabase
    .from("conversations")
    .update({
      last_message: message,
      last_message_at: new Date(),
    })
    .eq("id", conversationId);
}

export async function fetchMessages(conversationId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }

  return data;
}

export async function fetchConversations(profileId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`from_profile_id.eq.${profileId},to_profile_id.eq.${profileId}`)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching conversations: ${error.message}`);
  }

  return data;
}

export async function fetchAllProfiles(excludeProfileId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar")
    .or("avatar.eq.,avatar.is.null")
    .neq("id", excludeProfileId);

  console.log(data);
  if (error) {
    throw new Error(`Error fetching profiles: ${error.message}`);
  }

  return data;
}

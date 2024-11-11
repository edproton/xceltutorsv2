import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ChatButton from "./chat-button";
import { ConversationWithProfiles, Profile } from "./types";

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

  const currentUser = userData.user;
  const currentUserName = currentUser.user_metadata.full_name as string;

  // Fetch conversations
  const { data: conversations, error: conversationsError } = await supabase
    .from("conversations")
    .select(
      `
      id,
      from_profile:from_profile_id (id, name),
      to_profile:to_profile_id (id, name),
      last_message_at
    `
    )
    .or(
      `from_profile_id.eq.${currentUser.id},to_profile_id.eq.${currentUser.id}`
    )
    .returns<ConversationWithProfiles[]>();

  console.log(conversations);
  if (conversationsError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {conversationsError.message}
      </div>
    );
  }

  // Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name")
    .or("avatar.eq.,avatar.is.null")
    .neq("id", currentUser.id)
    .returns<Profile[]>();

  if (profilesError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {profilesError.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-2 text-primary">Messages</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {currentUserName}! Connect with your contacts.
      </p>

      <ScrollArea className="h-[75vh] w-full rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {profiles.map((profile) => {
            const existingConversation = conversations?.find(
              (conversation) =>
                conversation.to_profile.id === profile.id ||
                conversation.from_profile.id === profile.id
            );

            return (
              <Card
                key={profile.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.name}`}
                        />
                        <AvatarFallback>
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {profile.name}
                        </CardTitle>
                        {existingConversation && (
                          <p className="text-xs text-muted-foreground">
                            Last activity:{" "}
                            {new Date(
                              existingConversation.last_message_at
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {existingConversation && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ChatButton
                    existingConversation={existingConversation}
                    profileId={profile.id}
                    currentUserId={currentUser.id}
                    profileName={profile.name}
                    currentUserName={currentUserName}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "../../types";

type MessageHeaderProps = {
  otherProfile: Profile | null;
};

export default function MessageHeader({ otherProfile }: MessageHeaderProps) {
  return (
    <div className="border-b p-4 flex items-center space-x-3">
      <Avatar>
        <AvatarImage
          src={otherProfile?.avatar || undefined}
          alt={otherProfile?.name}
        />
        <AvatarFallback>
          <span className="font-medium text-base">
            {otherProfile?.name ? otherProfile.name[0].toUpperCase() : "?"}
          </span>
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{otherProfile?.name}</div>
      </div>
    </div>
  );
}

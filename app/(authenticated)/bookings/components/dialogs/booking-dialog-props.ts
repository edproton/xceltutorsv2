import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role } from "@/lib/types";

export interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: GetBookingsWithPaginationQueryResponseItem;
  oppositeParty: Profile;
  role: Role;
}

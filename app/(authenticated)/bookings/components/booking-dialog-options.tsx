import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Role } from "@/lib/types";
import {
  DialogType,
  getAvailableDialogOptions,
} from "./booking-dialogs-shared";

interface BookingDialogOptionsProps {
  booking: GetBookingsWithPaginationQueryResponseItem;
  role: Role;
  onOpenDialog: (
    booking: GetBookingsWithPaginationQueryResponseItem,
    dialogType: DialogType
  ) => void;
}

export function BookingDialogOptions({
  booking,
  role,
  onOpenDialog,
}: BookingDialogOptionsProps) {
  const dialogOptions = getAvailableDialogOptions(booking, role);

  if (dialogOptions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dialogOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onOpenDialog(booking, option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

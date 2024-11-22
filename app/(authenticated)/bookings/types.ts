import { BookingStatus, Role } from "@/lib/types";

export interface DialogOption {
  label: string;
  component: React.ComponentType;
  roles: Role[];
  status: BookingStatus[];
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from "@/lib/types";

interface BookingsHeaderProps {
  statusFilter: BookingStatus | "all";
  onStatusFilterChange: (status: BookingStatus | "all") => void;
}

export function BookingsHeader({
  statusFilter,
  onStatusFilterChange,
}: BookingsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Bookings</h1>
      <Select
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as BookingStatus | "all")
        }
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="AwaitingTutorConfirmation">
            Awaiting Tutor Confirmation
          </SelectItem>
          <SelectItem value="AwaitingStudentConfirmation">
            Awaiting Student Confirmation
          </SelectItem>
          <SelectItem value="AwaitingPayment">Awaiting Payment</SelectItem>
          <SelectItem value="PaymentFailed">Payment Failed</SelectItem>
          <SelectItem value="Scheduled">Scheduled</SelectItem>
          <SelectItem value="Canceled">Canceled</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

import { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookingStatusProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusProps) {
  const statusConfig: Record<
    BookingStatus,
    { label: string; className: string }
  > = {
    AwaitingTutorConfirmation: {
      label: "Awaiting Tutor Confirmation",
      className: "bg-blue-100 text-blue-800",
    },
    AwaitingStudentConfirmation: {
      label: "Awaiting Student Confirmation",
      className: "bg-purple-100 text-purple-800",
    },
    AwaitingPayment: {
      label: "Awaiting Payment",
      className: "bg-yellow-100 text-yellow-800",
    },
    PaymentFailed: {
      label: "Payment Failed",
      className: "bg-red-100 text-red-800",
    },
    Scheduled: {
      label: "Scheduled",
      className: "bg-green-100 text-green-800",
    },
    Canceled: {
      label: "Canceled",
      className: "bg-gray-100 text-gray-800",
    },
    Completed: {
      label: "Completed",
      className: "bg-indigo-100 text-indigo-800",
    },
  };

  const { label, className: statusClassName } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusClassName,
        className
      )}
    >
      {label}
    </span>
  );
}

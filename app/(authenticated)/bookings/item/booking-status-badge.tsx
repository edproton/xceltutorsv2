import { BookingStatus } from "@/lib/types";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case "Scheduled":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span className="text-sm">Scheduled</span>
        </div>
      );
    case "AwaitingPayment":
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Payment</span>
        </div>
      );
    case "AwaitingTutorConfirmation":
      return (
        <div className="flex items-center text-blue-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Tutor Confirmation</span>
        </div>
      );
    case "AwaitingStudentConfirmation":
      return (
        <div className="flex items-center text-orange-600">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">Awaiting Student Confirmation</span>
        </div>
      );
    case "PaymentFailed":
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-1 h-4 w-4" />
          <span className="text-sm">Payment Failed</span>
        </div>
      );
    case "Canceled":
      return (
        <div className="flex items-center text-gray-600">
          <XCircle className="mr-1 h-4 w-4" />
          <span className="text-sm">Canceled</span>
        </div>
      );
    case "Completed":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span className="text-sm">Completed</span>
        </div>
      );
    default:
      return null;
  }
}

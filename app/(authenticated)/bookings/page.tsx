import Bookings from "./bookings";
import { getBookingsWithPaginationQuery } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { GetBookingsWithPaginationQueryResponseItem } from "@/lib/queries/GetBookingsWithPaginationQuery";
import { Profile, Role } from "@/lib/types";

export default async function BookingsPage() {
  const getBookingsQuery = await getBookingsWithPaginationQuery();

  if (getBookingsQuery.bookings.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              No Bookings Found 📅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {`It looks like you haven't made any bookings yet. To get started,
              select a tutor and book your first lesson!`}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/view-tutors">
              <Button className="mt-4">Find a Tutor</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  function getOppositeParty(
    booking: GetBookingsWithPaginationQueryResponseItem
  ): {
    oppositeParty: Profile;
    role: Role;
  } {
    const isTutor = booking.forTutor.id === getBookingsQuery.userId;
    const oppositeParty = isTutor ? booking.createdBy : booking.forTutor;

    return {
      oppositeParty,
      role: isTutor ? "tutor" : "student",
    };
  }

  const { role, oppositeParty } = getOppositeParty(
    getBookingsQuery.bookings.items[0]
  );

  return (
    <div className="container mx-auto px-4">
      <Bookings
        initialBookings={getBookingsQuery.bookings.items}
        role={role}
        oppositeParty={oppositeParty}
      />
    </div>
  );
}

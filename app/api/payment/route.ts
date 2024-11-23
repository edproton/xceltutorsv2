import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { GetCurrentUserQuery } from "@/lib/queries/shared/GetCurrentUserQuery";
import { z } from "zod";
import { GetBookingByIdQuery } from "@/lib/queries/GetBookingByIdQuery";
import { SetBookingStatusCommand } from "@/lib/commands/SetBookingStatusCommand ";
import { getRedirectUrl } from "@/utils";

const paymentSchema = z.object({
  bookingId: z.coerce.number(),
});

async function validateBookingAndUser(bookingId: number) {
  // Get the current user
  const currentUserQuery = await GetCurrentUserQuery.execute();
  if (currentUserQuery.error) {
    return { error: "Failed to authenticate user", status: 401 };
  }

  const currentBooking = await GetBookingByIdQuery.execute(bookingId);
  if (currentBooking.error) {
    return { error: "Booking not found", status: 404 };
  }

  const belongsToCurrentUser =
    (currentBooking.data.createdBy.id || currentBooking.data.forTutor.id) ===
    currentUserQuery.data.id;
  if (!belongsToCurrentUser) {
    return { error: "Unauthorized to pay for this booking", status: 403 };
  }

  return { currentUserQuery, currentBooking };
}

export const POST = async (request: Request) => {
  const origin = request.headers.get("origin");
  const cancelUrl = request.headers.get("referer") || `${origin}/`;

  try {
    // Parse and validate the form data
    const formData = await request.formData();
    const validatedData = paymentSchema.safeParse({
      bookingId: formData.get("bookingId"),
    });
    if (!validatedData.success) {
      return Response.json(
        { error: "Invalid booking ID", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const validation = await validateBookingAndUser(
      validatedData.data.bookingId
    );
    if ("error" in validation) {
      return Response.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const { currentUserQuery, currentBooking } = validation;

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: currentUserQuery.data.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Tutoring Session",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/api/payment?session_id={CHECKOUT_SESSION_ID}&bookingId=${currentBooking.data.id}`,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: currentBooking.data.id,
      },
    });

    if (!stripeSession || !stripeSession.url) {
      throw new Error("Failed to create checkout session");
    }

    return NextResponse.redirect(stripeSession.url, 303);
  } catch (err) {
    console.error("Error creating checkout session:", err);

    if (err instanceof stripe.errors.StripeError) {
      return Response.json(
        { error: "Payment processing error", details: err.message },
        { status: 502 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  const origin = request.headers.get("origin");

  try {
    // Parse and validate the form data
    const formData = await request.formData();
    const validatedData = paymentSchema.safeParse({
      bookingId: formData.get("bookingId"),
    });
    if (!validatedData.success) {
      return Response.json(
        { error: "Invalid booking ID", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const validation = await validateBookingAndUser(
      validatedData.data.bookingId
    );
    if ("error" in validation) {
      return Response.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const updatedBooking = await SetBookingStatusCommand.execute(
      validatedData.data.bookingId,
      "Scheduled"
    );

    if (updatedBooking.error) {
      console.error("Error updating booking status:", updatedBooking.error);
      return Response.json(
        { error: "Failed to update booking status" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(`${origin}/bookings`, 303);
  } catch (err) {
    console.error("Error updating booking status:", err);

    if (err instanceof Error) {
      return Response.json({ error: err.message }, { status: 500 });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");

  if (!sessionId || !bookingId) {
    return Response.json(
      { error: "Missing session_id or bookingId" },
      { status: 400 }
    );
  }

  try {
    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return Response.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Update the booking status
    const updatedBooking = await SetBookingStatusCommand.execute(
      parseInt(bookingId),
      "Scheduled"
    );

    if (updatedBooking.error) {
      console.error("Error updating booking status:", updatedBooking.error);
      return Response.json(
        { error: "Failed to update booking status" },
        { status: 500 }
      );
    }

    const redirectUrl = getRedirectUrl("/bookings");

    // Redirect to the bookings page
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Error processing successful payment:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const origin = request.headers.get("origin");
  const cancelUrl = request.headers.get("referer") || `${origin}/`;

  try {
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${origin}/bookings`,
      cancel_url: cancelUrl,
    });

    if (!session || !session.url) {
      throw new Error("Failed to create checkout session");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return Response.json(err, {
      status: 400,
    });
  }
};

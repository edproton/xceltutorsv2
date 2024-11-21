import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      billing_address_collection: "auto",
      line_items: [
        {
          price: "price_1QNZWWBczLIaq2UDaIUBaggZ",
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${request.headers.get(
        "origin"
      )}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (err) {
    return Response.json(err, {
      status: 400,
    });
  }
};

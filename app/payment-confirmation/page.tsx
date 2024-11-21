import { stripe } from "@/lib/stripe";

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  if (!sessionId || typeof sessionId !== "string") {
    return <p>Error: Invalid session ID!</p>;
  }

  const session = await getSession(sessionId);

  if (!session) {
    return <p>Error: Session not found!</p>;
  }

  if (session.status === "open") {
    return <p>Payment is still in progress.</p>;
  }

  if (session.status === "complete") {
    // * upgrade the membership or do something to make change to the database to mark this payment complete
    // * this can be making the user a PRO member or add items ... etc.
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background py-32">
        <h1 className="text-4xl font-bold">Thank you for your purchase!</h1>
        <h3 className="text-xl font-semibold">You are now a pro user!</h3>
      </div>
    );
  }

  return <p>Unexpected session status: {session.status}</p>;
}

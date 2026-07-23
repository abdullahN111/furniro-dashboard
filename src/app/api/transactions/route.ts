import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET() {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 20,
    });

    return NextResponse.json(payments.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
      },
      { status: 500 },
    );
  }
}

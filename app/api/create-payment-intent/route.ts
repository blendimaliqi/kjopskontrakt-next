import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (øre)
      currency: "nok",
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret as string,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

export function methodNotAllowed(req: NextRequest) {
  return NextResponse.json(
    { error: `Method ${req.method} Not Allowed` },
    { status: 405 }
  );
}

export async function handler(req: NextRequest) {
  if (req.method === "POST") {
    return POST(req);
  } else {
    return methodNotAllowed(req);
  }
}

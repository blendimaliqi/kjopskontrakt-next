// app/api/account/withdraw/route.ts
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    const body = await req.json();
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      console.log("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("email", session.user?.email)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Database error fetching balance" },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("User not found:", session.user?.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < amount) {
      console.log("Insufficient balance. Current balance:", user.balance);
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const newBalance = user.balance - amount;

    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", session.user?.email);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Database error updating balance" },
        { status: 500 }
      );
    }

    // Record the transaction
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_email: session.user?.email,
        amount: -amount, // Negative amount for withdrawals
        type: "usage",
        description: description || "Generering av kjøpskontrakt",
        created_at: new Date().toISOString(),
      });

    if (transactionError) {
      console.error("Transaction recording error:", transactionError);
      // We don't want to fail the whole operation if just the transaction recording fails
      // But we should log it for investigation
    }

    console.log("New balance after withdrawal:", newBalance);
    return NextResponse.json({ balance: newBalance });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

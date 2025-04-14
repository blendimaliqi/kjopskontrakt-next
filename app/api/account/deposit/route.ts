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
    const { amount } = body;

    if (!amount || amount <= 0) {
      console.log("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (amount < 40) {
      console.log("Amount below minimum:", amount);
      return NextResponse.json(
        { error: "Minimum amount is 40 NOK" },
        { status: 400 }
      );
    }

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("email", session.user?.email);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Database error fetching balance" },
        { status: 500 }
      );
    }

    let user = users?.[0];

    if (!user) {
      console.log("User not found. Attempting to create new user record.");
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ email: session.user?.email, balance: 0 })
        .select()
        .single();

      if (createError) {
        console.error("Create user error:", createError);
        console.error(
          "Create user error details:",
          JSON.stringify(createError, null, 2)
        );
        return NextResponse.json(
          { error: `Failed to create user record: ${createError.message}` },
          { status: 500 }
        );
      }

      if (!newUser) {
        console.error("New user data is null after successful insert");
        return NextResponse.json(
          { error: "Failed to retrieve new user data after creation" },
          { status: 500 }
        );
      }

      user = newUser;
    }

    console.log("Current user balance:", user.balance);

    const newBalance = user.balance + amount;

    // Update the user's balance
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
        amount: amount,
        type: "deposit",
        description: "Påfylling av saldo",
        created_at: new Date().toISOString(),
      });

    if (transactionError) {
      console.error("Transaction recording error:", transactionError);
      // We don't want to fail the whole operation if just the transaction recording fails
      // But we should log it for investigation
    }

    console.log("New balance:", newBalance);
    return NextResponse.json({ balance: newBalance });
  } catch (error) {
    console.error("Unexpected error:", error);
    console.error("Unexpected error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

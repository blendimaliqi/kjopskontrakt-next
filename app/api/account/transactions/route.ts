import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions/authOptions";

// Make the route dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch real transactions from the database
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_email", session.user?.email)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json(
        { error: "Database error fetching transactions" },
        { status: 500 }
      );
    }

    // Transform data to match the expected format in the frontend
    const formattedTransactions = transactions.map((tx) => ({
      id: tx.id,
      date: tx.created_at,
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
    }));

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

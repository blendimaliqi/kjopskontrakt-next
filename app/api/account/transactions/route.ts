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

    // For now, return mock transactions
    // In a real implementation, you would fetch from your database
    const mockTransactions = [
      {
        id: "1",
        date: "2023-09-15",
        amount: 100,
        type: "deposit",
        description: "Påfylling av saldo",
      },
      {
        id: "2",
        date: "2023-09-16",
        amount: -9.9,
        type: "usage",
        description: "Generering av kjøpskontrakt",
      },
      {
        id: "3",
        date: "2023-09-17",
        amount: 50,
        type: "deposit",
        description: "Påfylling av saldo",
      },
    ];

    return NextResponse.json({ transactions: mockTransactions });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

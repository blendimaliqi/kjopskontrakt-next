import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

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

    console.log("User balance:", user.balance);
    return NextResponse.json({ balance: user.balance });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

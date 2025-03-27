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

    console.log("Session user:", session.user);

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
        return NextResponse.json(
          { error: `Failed to create user record: ${createError.message}` },
          { status: 500 }
        );
      }

      user = newUser;
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

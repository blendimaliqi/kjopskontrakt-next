import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions/authOptions";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    const body = await req.json();
    const { email, password, newEmail } = body;

    if (!email || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify current credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update email if provided
    if (newEmail && newEmail !== email) {
      const { error: updateEmailError } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (updateEmailError) {
        console.error("Email update error:", updateEmailError);
        return NextResponse.json(
          { error: "Failed to update email" },
          { status: 500 }
        );
      }

      // Update email in the custom users table
      const { error: customUpdateError } = await supabase
        .from("users")
        .update({ email: newEmail })
        .eq("email", email);

      if (customUpdateError) {
        console.error("Custom table update error:", customUpdateError);
        return NextResponse.json(
          { error: "Failed to update email in custom table" },
          { status: 500 }
        );
      }
    }

    // Update password if a new one is provided
    if (body.newPassword) {
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: body.newPassword,
      });
      if (updatePasswordError) {
        console.error("Password update error:", updatePasswordError);
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 500 }
        );
      }
    }

    // Update other user settings if provided
    const updateData: { [key: string]: any } = {};
    ["name", "avatar_url", "preferences"].forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("email", newEmail || email);

      if (updateError) {
        console.error("Settings update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update user settings" },
          { status: 500 }
        );
      }
    }

    console.log("User settings updated successfully");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

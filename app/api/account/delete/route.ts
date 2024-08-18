import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete user data from the users table
    const { error: deleteDataError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteDataError) {
      console.error("Error deleting user data:", deleteDataError);
      return NextResponse.json(
        { error: "Failed to delete user data" },
        { status: 500 }
      );
    }

    // Delete the user's own account
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      userId
    );

    if (deleteUserError) {
      console.error("Error deleting user account:", deleteUserError);
      // If we can't delete the auth user, we should handle this gracefully
      // Maybe set a flag in the database to mark this account for deletion
      return NextResponse.json(
        { error: "Failed to delete user account, please contact support" },
        { status: 500 }
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

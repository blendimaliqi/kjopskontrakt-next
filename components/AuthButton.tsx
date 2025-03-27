"use client";

import SignUp from "@/app/auth/signup/page";
import { signIn, signOut, useSession } from "next-auth/react";
import { getBaseUrl } from "@/utils/auth";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <button
        onClick={() => {
          const baseUrl = getBaseUrl();
          signOut({ callbackUrl: baseUrl });
        }}
      >
        Sign out
      </button>
    );
  }
  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}

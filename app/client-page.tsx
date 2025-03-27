"use client";

import React from "react";
import LandingPageContent from "@/components/Landingpage";
import MobileLandingPage from "@/components/MobileLandingPage";
import { useSession } from "next-auth/react";

export default function ClientPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="w-full mx-auto px-0 py-0">
      <div className="hidden md:block">
        <LandingPageContent isLoggedIn={isLoggedIn} />
      </div>
      <div className="block md:hidden">
        <MobileLandingPage isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

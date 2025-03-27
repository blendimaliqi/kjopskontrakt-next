"use client";

import React from "react";
import LandingPageContent from "@/components/Landingpage";
import MobileLandingPage from "@/components/MobileLandingPage";

export default function ClientPage() {
  return (
    <div className="w-full mx-auto px-0 py-0">
      <div className="hidden md:block">
        <LandingPageContent />
      </div>
      <div className="block md:hidden">
        <MobileLandingPage />
      </div>
    </div>
  );
}

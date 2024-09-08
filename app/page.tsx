"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import MobilePurchaseContractForm from "@/components/MobilePurchaseContractForm";
import LandingPageContent from "../components/Landingpage";
import MobileLandingPageContent from "../components/MobileLandingPage";

export default function Home() {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const LandingPageContents = isMobile
    ? MobileLandingPageContent
    : LandingPageContent;

  const ContractForm = isMobile
    ? MobilePurchaseContractForm
    : PurchaseContractForm;

  return (
    <main className="container mx-auto px-4 py-8">
      {session && session.user && session.user.email ? (
        <ContractForm />
      ) : (
        <LandingPageContents />
      )}
    </main>
  );
}

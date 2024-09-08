"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import MobilePurchaseContractForm from "@/components/MobilePurchaseContractForm";
import LandingPageContent from "../components/Landingpage";
import MobileLandingPageContent from "../components/MobileLandingPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kjøpskontrakt-bil Generator | Lag juridisk bindende kontrakter",
  description:
    "Lag profesjonelle og juridisk bindende kjøpskontrakter for bil enkelt og raskt. Perfekt for privatpersoner og bilforhandlere.",
  keywords:
    "kjøpskontrakt, bil, bruktbil, kontrakt generator, juridisk bindende, bilsalg",
  openGraph: {
    title: "Kjøpskontrakt-bil Generator | Enkel og sikker kontraktgenerering",
    description:
      "Generer profesjonelle kjøpskontrakter for bil på minutter. Sikre og juridisk bindende avtaler for trygge bilkjøp og -salg.",
    type: "website",
  },
};

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

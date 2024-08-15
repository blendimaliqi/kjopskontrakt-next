"use client";
import React from "react";
import { useSession } from "next-auth/react";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import LandingPageContent from "@/components/Landingpage";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="container mx-auto px-4 py-8">
      {session && session.user && session.user.email ? (
        <PurchaseContractForm />
      ) : (
        <LandingPageContent />
      )}
    </main>
  );
}

import React from "react";
import { Metadata } from "next";
import PricingPageContent from "@/components/PricingPageContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Priser | Kjøpskontrakt-bil Generator",
  description: "Se våre konkurransedyktige priser for Kjøpskontrakt-bil Generator. Rimelig og pålitelig tjeneste for å generere kjøpskontrakter for bil.",
  keywords: "priser, kostnader, kjøpskontrakt, bil, generator, betaling",
  openGraph: {
    title: "Priser | Kjøpskontrakt-bil Generator",
    description: "Se våre konkurransedyktige priser for Kjøpskontrakt-bil Generator.",
    type: "website",
    url: "https://kjopskontrakt.no/pricing",
  },
  robots: "index, follow",
};

const PricingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center space-x-4">
      <PricingPageContent />

      <Button asChild variant="default" className="w-4/6">
        <Link href="/payments-form">
          <Wallet className="mr-2 h-4 w-4" />
          <span>Legg til ønsket beløp</span>
        </Link>
      </Button>
    </div>
  );
};

export default PricingPage;

import React from "react";
import PricingPageContent from "@/components/PricingPageContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet } from "lucide-react";

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

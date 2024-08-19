"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  FileText,
  CreditCard,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const PricingPageContent = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Fleksibel prising</h1>
          <p className="text-xl">Betal kun for det du bruker</p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Med vår fleksible prismodell kan du enkelt sette inn penger og
            betale per generert PDF. Ingen abonnement eller skjulte gebyrer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Wallet, text: "Sett inn valgfritt beløp" },
              { icon: FileText, text: "9,90 kr per generert PDF" },
              { icon: CreditCard, text: "Sikker betaling" },
              { icon: RefreshCcw, text: "Fyll på når du ønsker" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <feature.icon className="w-8 h-8" />
                <span className="text-gray-800">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Slik fungerer det:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Registrer deg for en konto</li>
              <li>Sett inn ønsket beløp (f.eks. 100 kr, 500 kr)</li>
              <li>Generer PDF-er etter behov</li>
              <li>9,90 kr trekkes fra saldoen din per generert PDF</li>
              <li>Fyll på kontoen din når saldoen blir lav</li>
            </ol>
          </div>

          <p className="text-center text-lg font-semibold">
            Kom i gang i dag og opplev friheten med vår fleksible prismodell!
          </p>
        </main>

        {/* <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/auth/signin">Logg inn</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Registrer deg</Link>
            </Button>
          </div> */}
      </div>
    </div>
  );
};

export default PricingPageContent;

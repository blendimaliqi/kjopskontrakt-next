import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import PricingPageContent from "./PricingPageContent";
import { generateDemoPDF } from "@/utils/demoPDF";

const LandingPageContent = () => {
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="max-w-4xl w-full space-y-20">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Kjøpskontrakt for bil
          </h1>
          <p className="text-xl">
            Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for bil
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Velkommen til vår kjøpskontrakt-generator for bil. Her kan du enkelt
            opprette en profesjonell og lovlig bindende kjøpsavtale i form av
            pdf for kjøp og salg av bruktbil.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Shield, text: "Sikker og pålitelig kontrakt" },
              { icon: Zap, text: "Rask utfylling av skjema" },
              { icon: BookOpen, text: "Tilpasset norske lover og regler" },
              { icon: Users, text: "Perfekt for privatpersoner og bedrifter" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <feature.icon className="w-8 h-8" />
                <span className="text-gray-800">{feature.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-lg font-semibold">
            Registrer deg eller logg inn for å begynne å lage din kjøpskontrakt
            for bil i dag!
          </p>
        </main>

        <section className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 space-y-6  ">
          <h2 className="text-2xl font-bold text-center text-white">
            Prøv vår PDF-generator
          </h2>
          <p className="text-lg text-gray-100 text-center">
            Vil du se hvordan vår kjøpskontrakt kan se ut? Generer en demo-PDF
            med forhåndsutfylte data.
          </p>
          <div className="flex justify-center">
            <Button
              asChild
              onClick={() => generateDemoPDF()}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <div className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Generer Demo PDF
              </div>
            </Button>
          </div>
        </section>

        <div>
          <PricingPageContent />
        </div>

        <div className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/auth/signin">Logg inn</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Registrer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;

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
    <div className="flex flex-col justify-center items-center p-4 md:p-6">
      <div className="max-w-4xl w-full space-y-8 md:space-y-20">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Kjøpskontrakt for bil
          </h1>
          <p className="text-lg md:text-xl">
            Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for bil
          </p>
        </header>

        <main className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8 space-y-6 md:space-y-8">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Velkommen til vår kjøpskontrakt-generator for bil. Her kan du enkelt
            opprette en profesjonell og lovlig bindende kjøpsavtale i form av
            pdf for kjøp og salg av bruktbil.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {[
              { icon: Shield, text: "Sikker og pålitelig kontrakt" },
              { icon: Zap, text: "Rask utfylling av skjema" },
              { icon: BookOpen, text: "Tilpasset norske lover og regler" },
              { icon: Users, text: "Perfekt for privatpersoner og bedrifter" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 md:space-x-4"
              >
                <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-sm md:text-base text-gray-800">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-base md:text-lg font-semibold">
            Registrer deg eller logg inn for å begynne å lage din kjøpskontrakt
            for bil i dag!
          </p>
        </main>

        <section className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-6 md:p-8 space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-center text-white">
            Prøv vår PDF-generator
          </h2>
          <p className="text-base md:text-lg text-gray-100 text-center">
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

        <div className="mt-8 md:mt-0">
          <PricingPageContent />
        </div>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/auth/signin">Logg inn</Link>
          </Button>
          <Button asChild className="w-full md:w-auto">
            <Link href="/auth/signup">Registrer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;

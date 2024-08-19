import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import PricingPageContent from "./PricingPageContent";

const LandingPageContent = () => {
  return (
    <div className=" flex flex-col justify-center items-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Kjøpskontrakt for bil
          </h1>
          <p className="text-xl ">
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
                <feature.icon className="w-8 h-8 " />
                <span className="text-gray-800">{feature.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-lg font-semibold">
            Registrer deg eller logg inn for å begynne å lage din kjøpskontrakt
            for bil i dag!
          </p>
        </main>

        <div style={{ marginTop: "120px" }}>
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

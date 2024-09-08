import React from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrering fullført | Kjøpskontrakt for bil",
  description:
    "Din registrering er fullført. Start med å lage din første kjøpskontrakt for bil nå!",
  keywords: "kjøpskontrakt, bil, registrering, bruktbil, kontrakt generator",
  openGraph: {
    title: "Registrering fullført | Kjøpskontrakt for bil",
    description:
      "Din registrering er fullført. Start med å lage din første kjøpskontrakt for bil nå!",
    type: "website",
  },
};

const SignupConfirmationPage = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 md:p-6">
      <div className="max-w-4xl w-full space-y-8 md:space-y-20">
        <header className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-green-500 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-bold">
            Registrering fullført!
          </h1>
          <p className="text-lg md:text-xl">
            Velkommen til vår tjeneste for kjøpskontrakter for bil
          </p>
        </header>

        <main className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8 space-y-6 md:space-y-8">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Takk for at du registrerte deg hos oss. Din konto er nå aktivert, og
            du kan begynne å bruke vår kjøpskontrakt-generator for bil. Her kan
            du enkelt opprette profesjonelle og lovlig bindende kjøpsavtaler for
            kjøp og salg av bruktbil.
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
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                <span className="text-sm md:text-base text-gray-800">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-base md:text-lg font-semibold">
            Du er nå klar til å begynne å lage din første kjøpskontrakt for bil!
          </p>
        </main>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Button asChild className="w-full md:w-auto">
            <Link href="/auth/signin">
              Logg inn <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupConfirmationPage;

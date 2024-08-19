import React from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  BookOpen,
  Users,
  FileText,
  Wallet,
  CreditCard,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { generateDemoPDF } from "@/utils/demoPDF";

const MobileLandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 text-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Kjøpskontrakt for bil
        </h1>
      </header>

      <main className="flex-grow p-4 space-y-6">
        <section className="bg-white rounded-lg shadow p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for bil
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signup">Kom i gang</Link>
          </Button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Hvorfor velge oss?</h2>
          <ul className="space-y-3">
            {[
              { icon: Shield, text: "Sikker og pålitelig" },
              { icon: Zap, text: "Rask utfylling" },
              { icon: BookOpen, text: "Norsk lovverk" },
              { icon: Users, text: "For alle brukere" },
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 bg-white p-3 rounded-md shadow-sm"
              >
                <feature.icon className="w-5 h-5 text-blue-500" />
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white space-y-3">
          <h2 className="text-lg font-semibold">Prøv vår PDF-generator</h2>
          <p className="text-sm">Se hvordan kontrakten kan se ut</p>
          <Button
            onClick={() => generateDemoPDF()}
            className="w-full bg-white text-blue-600 hover:bg-gray-100"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generer Demo PDF
          </Button>
        </section>

        <section className="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Fleksibel prising</h2>
          <p className="text-sm text-gray-600">
            Betal kun for det du bruker - ingen abonnement eller skjulte gebyrer
          </p>
          <ul className="space-y-3">
            {[
              { icon: Wallet, text: "Sett inn valgfritt beløp" },
              { icon: FileText, text: "9,90 kr per generert PDF" },
              { icon: CreditCard, text: "Sikker betaling" },
              { icon: RefreshCcw, text: "Fyll på når du ønsker" },
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md"
              >
                <feature.icon className="w-5 h-5 text-blue-500" />
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-white shadow-sm p-4 space-y-3">
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/signin">Logg inn</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/auth/signup">Registrer deg</Link>
        </Button>
      </footer>
    </div>
  );
};

export default MobileLandingPage;

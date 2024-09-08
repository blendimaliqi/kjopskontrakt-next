import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Side ikke funnet | Kjøpskontrakt-bil Generator",
  description: "Beklager, men siden du leter etter finnes ikke. Gå tilbake til forsiden eller kontakt vår kundeservice.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-2xl w-full space-y-8 md:space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
            Side ikke funnet
          </h2>
        </header>

        <main className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8 space-y-6 md:space-y-8">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
            Beklager, men siden du leter etter finnes ikke. Den kan ha blitt
            flyttet, slettet eller aldri eksistert.
          </p>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Gå til forsiden
              </Link>
            </Button>
          </div>
        </main>

        <footer className="text-center text-sm md:text-base text-gray-600">
          <p>
            Hvis du mener dette er en feil, vennligst kontakt vår kundeservice.
          </p>
        </footer>
      </div>
    </div>
  );
}

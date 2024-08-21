"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-6 bg-gray-50">
          <div className="max-w-2xl w-full space-y-8 md:space-y-12">
            <header className="text-center space-y-4">
              <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-red-500 mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Oisann! Noe gikk veldig galt
              </h1>
            </header>

            <main className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8 space-y-6 md:space-y-8">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
                Vi beklager, men det oppstod en alvorlig feil i applikasjonen.
                Vår tekniske team har blitt varslet og jobber med å løse
                problemet.
              </p>

              {error.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm md:text-base text-red-800">
                    Feilmelding: {error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button onClick={() => reset()} className="w-full md:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Prøv igjen
                </Button>
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
                Hvis problemet vedvarer, vennligst kontakt vår kundeservice.
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

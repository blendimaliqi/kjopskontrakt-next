import React from "react";
import { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt Oss | Kjøpskontrakt-bil Generator",
  description:
    "Kontakt oss for spørsmål, tilbakemeldinger eller hjelp med vår kjøpskontrakt-tjeneste.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Kontakt Oss
        </h1>

        <div className="bg-white shadow-md rounded-xl p-8">
          <p className="text-lg text-gray-700 mb-8">
            Har du spørsmål, tilbakemeldinger eller trenger du hjelp med vår
            tjeneste? Ta gjerne kontakt med oss, og vi vil svare deg så raskt
            som mulig.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mr-4 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">E-post</h3>
                <a
                  href="mailto:support@kjopskontrakt.no"
                  className="text-blue-600 hover:underline"
                >
                  support@kjopskontrakt.no
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Metadata } from "next";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Personvernerklæring | Kjøpskontrakt-bil Generator",
  description: "Les vår personvernerklæring for å forstå hvordan vi beskytter dine personopplysninger når du bruker Kjøpskontrakt-bil Generator.",
  keywords: "personvern, personvernerklæring, databehandling, sikkerhet, kjøpskontrakt, bil",
  openGraph: {
    title: "Personvernerklæring | Kjøpskontrakt-bil Generator",
    description: "Les vår personvernerklæring for Kjøpskontrakt-bil Generator.",
    type: "website",
    url: "https://kjopskontrakt.no/privacy-policy",
  },
  robots: "index, follow",
};

const PrivacyPolicyPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Personvernerklæring for Kjøpskontrakt-bil Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introduksjon</h2>
                <p>
                  Denne personvernerklæringen forklarer hvordan
                  Kjøpskontrakt-bil Generator, drevet av en uavhengig utvikler,
                  håndterer dine personopplysninger. Vi er forpliktet til å
                  beskytte ditt personvern og håndtere dine data med største
                  forsiktighet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  2. Informasjon vi samler inn
                </h2>
                <p>
                  Vår tjeneste er designet for å fungere uten å samle inn eller
                  lagre personopplysninger. All informasjon du oppgir for å
                  generere en kontrakt behandles utelukkende lokalt i din
                  nettleser.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  3. Hvordan vi bruker informasjonen
                </h2>
                <p>
                  Informasjonen du oppgir brukes kun til å generere
                  kjøpskontrakten i din nettleser. Vi har ingen tilgang til
                  denne informasjonen, og den sendes ikke til våre servere.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Datalagring</h2>
                <p>
                  Vi lagrer ingen personopplysninger på våre servere. All
                  databehandling skjer lokalt på din enhet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  5. Informasjonssikkerhet
                </h2>
                <p>
                  Siden all databehandling skjer lokalt på din enhet, er
                  sikkerheten av dine data hovedsakelig avhengig av sikkerheten
                  til din egen enhet og nettleser.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  6. Dine rettigheter
                </h2>
                <p>
                  Du har rett til å få innsyn i, korrigere eller slette dine
                  personopplysninger. Siden vi ikke lagrer noen
                  personopplysninger, kan disse rettighetene utøves ved å
                  kontrollere informasjonen du selv legger inn i tjenesten.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  7. Endringer i personvernerklæringen
                </h2>
                <p>
                  Vi forbeholder oss retten til å oppdatere denne
                  personvernerklæringen ved behov. Eventuelle endringer vil bli
                  publisert på denne siden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Kontakt oss</h2>
                <p>
                  Hvis du har spørsmål om denne personvernerklæringen eller vår
                  håndtering av personopplysninger, vennligst kontakt oss på:
                  support@kjopskontrakt.no
                </p>
              </section>

              <p className="text-sm text-gray-500">
                Sist oppdatert: {new Date().toLocaleDateString("no-NO")}
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;

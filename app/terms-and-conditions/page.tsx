import React from "react";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vilkår og betingelser | Kjøpskontrakt-bil Generator",
  description: "Les våre vilkår og betingelser for bruk av Kjøpskontrakt-bil Generator. Finn informasjon om tjenestebeskrivelse, priser, ansvar, og mer.",
  keywords: "vilkår og betingelser, kjøpskontrakt, bil, generator, juridisk informasjon",
  openGraph: {
    title: "Vilkår og betingelser | Kjøpskontrakt-bil Generator",
    description: "Les våre vilkår og betingelser for bruk av Kjøpskontrakt-bil Generator.",
    type: "website",
  },
};

const TermsAndConditions: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Vilkår og betingelser for Kjøpskontrakt-bil Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Generelt</h2>
                <p>
                  1.1 Disse vilkårene og betingelsene gjelder for bruk av
                  Kjøpskontrakt-bil Generator, heretter kalt "tjenesten", som
                  tilbys av en uavhengig utvikler.
                </p>
                <p>
                  1.2 Ved å bruke tjenesten aksepterer du disse vilkårene og
                  betingelsene i sin helhet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  2. Tjenestebeskrivelse
                </h2>
                <p>
                  2.1 Tjenesten tilbyr en automatisert generering av
                  kjøpskontrakter for biler basert på informasjon oppgitt av
                  brukeren.
                </p>
                <p>
                  2.2 Kontraktene som genereres er ment som et utgangspunkt og
                  kan kreve ytterligere tilpasninger for å møte spesifikke behov
                  eller lovkrav.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  3. Priser og betaling
                </h2>
                <p>
                  3.1 Bruk av tjenesten er betalingspliktig. Gjeldende priser er
                  oppgitt på tjenestens nettside.
                </p>
                <p>
                  3.2 Betaling skjer gjennom de betalingsmetodene som tilbys på
                  nettsiden.
                </p>
                <p>
                  3.3 Alle priser er oppgitt i norske kroner (NOK) og inkluderer
                  merverdiavgift (MVA).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  4. Brukerens ansvar
                </h2>
                <p>
                  4.1 Brukeren er ansvarlig for å oppgi korrekt og fullstendig
                  informasjon ved bruk av tjenesten.
                </p>
                <p>
                  4.2 Brukeren er ansvarlig for å sikre at den genererte
                  kontrakten er i samsvar med gjeldende lover og forskrifter.
                </p>
                <p>
                  4.3 Det er brukerens ansvar å søke juridisk rådgivning hvis
                  det er usikkerhet rundt kontraktens innhold eller gyldighet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  5. Ansvarsfraskrivelse
                </h2>
                <p>
                  5.1 Tjenesten tilbys "som den er" uten noen form for garanti.
                </p>
                <p>
                  5.2 Utvikleren tar ikke ansvar for eventuelle feil eller
                  mangler i de genererte kontraktene.
                </p>
                <p>
                  5.3 Utvikleren er ikke ansvarlig for eventuelle tap eller
                  skader som måtte oppstå som følge av bruken av tjenesten.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  6. Personvern og datahåndtering
                </h2>
                <p>
                  6.1 All informasjon som oppgis av brukeren behandles
                  konfidensielt og i samsvar med gjeldende personvernlovgivning.
                </p>
                <p>
                  6.2 Informasjonen som oppgis brukes kun til å generere den
                  ønskede kontrakten og lagres ikke permanent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  7. Immaterielle rettigheter
                </h2>
                <p>
                  7.1 Alle rettigheter til tjenesten, inkludert programvare og
                  design, tilhører utvikleren.
                </p>
                <p>
                  7.2 Brukeren får en begrenset, ikke-eksklusiv rett til å bruke
                  den genererte kontrakten for eget formål.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  8. Endringer i vilkår og betingelser
                </h2>
                <p>
                  8.1 Utvikleren forbeholder seg retten til å endre disse
                  vilkårene og betingelsene uten forvarsel.
                </p>
                <p>
                  8.2 Endringer vil tre i kraft umiddelbart etter publisering på
                  tjenestens nettside.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  9. Gjeldende lov og verneting
                </h2>
                <p>
                  9.1 Disse vilkårene og betingelsene er underlagt norsk lov.
                </p>
                <p>
                  9.2 Eventuelle tvister skal søkes løst gjennom forhandlinger.
                  Hvis dette ikke fører fram, skal tvisten avgjøres av norske
                  domstoler.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  10. Kontaktinformasjon
                </h2>
                <p>
                  For spørsmål eller henvendelser angående disse vilkårene og
                  betingelsene, vennligst kontakt utvikleren på:
                </p>
                <p>E-post: support@kjopskontrakt.no</p>
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

export default TermsAndConditions;

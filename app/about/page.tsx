import React from "react";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutUs: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Om oss</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Vår historie</h2>
          <p>
            Kjøpskontrakt-bil Generator ble utviklet for å forenkle prosessen
            med å lage juridisk bindende kontrakter for bilkjøp og salg. Vår
            tjeneste ble skapt ut fra et ønske om å gjøre denne ofte kompliserte
            prosessen mer tilgjengelig og brukervennlig for alle.
          </p>

          <h2 className="text-xl font-semibold">Vår misjon</h2>
          <p>
            Vår misjon er å tilby en pålitelig, brukervennlig og rimelig løsning
            for å generere skreddersydde kjøpskontrakter for bil. Vi streber
            etter å gjøre bilhandel tryggere og enklere for både kjøpere og
            selgere.
          </p>

          <h2 className="text-xl font-semibold">Hva vi tilbyr</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              En enkel online tjeneste for å generere kjøpskontrakter for bil
            </li>
            <li>
              Juridisk formulerte kontrakter tilpasset ditt spesifikke bilkjøp
              eller -salg
            </li>
            <li>Rimelig pris på kun kr 9.90 per generert kontrakt</li>
            <li>Sikker betalingsløsning</li>
            <li>
              Full konfidensialitet - ingen lagring av dine data på våre servere
            </li>
            <li>Tilgjengelig for både privatpersoner og bedrifter</li>
            <li>Responsivt design som fungerer på alle enheter</li>
          </ul>

          <h2 className="text-xl font-semibold">Våre verdier</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Brukervennlighet: Vi streber etter å gjøre vår tjeneste så enkel
              og intuitiv som mulig.
            </li>
            <li>
              Sikkerhet: Din personlige informasjon og data er av største
              viktighet for oss.
            </li>
            <li>
              Pålitelighet: Vi tilbyr kontrakter basert på standard juridiske
              formuleringer.
            </li>
            <li>
              Kundeservice: Vi er her for å hjelpe deg med eventuelle spørsmål
              eller bekymringer.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">Kontakt oss</h2>
          <p>
            Har du spørsmål eller trenger du assistanse? Ikke nøl med å kontakte
            oss på support@kjopskontrakt.no. Vi er her for å hjelpe deg med å
            gjøre din bilhandel så enkel og trygg som mulig.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs;

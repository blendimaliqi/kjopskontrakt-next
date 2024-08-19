import React from "react";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactUsPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Kontakt oss</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              Har du spørsmål eller tilbakemeldinger?
            </h2>
            <p>
              Vi setter pris på alle henvendelser og tilbakemeldinger fra våre
              brukere. Ikke nøl med å ta kontakt hvis du har spørsmål om
              Kjøpskontrakt-bil Generator, trenger hjelp, eller bare vil dele
              dine tanker om tjenesten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Kontaktinformasjon</h2>
            <p>E-post: support@kjopskontrakt.no</p>
            <p>
              Vi besvarer alle henvendelser så raskt som mulig, vanligvis innen
              24 timer på hverdager.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Åpningstider</h2>
            <p>
              Vår kundeservice er tilgjengelig via e-post mandag til fredag, fra
              09:00 til 17:00.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Ofte stilte spørsmål</h2>
            <p>
              Før du kontakter oss, kan det være lurt å sjekke vår{" "}
              <a href="/faq" className="text-blue-600 hover:underline">
                FAQ-side
              </a>
              . Der finner du svar på mange vanlige spørsmål om vår tjeneste.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Feilrapportering</h2>
            <p>
              Hvis du oppdager en feil eller et problem med tjenesten vår,
              vennligst gi oss så detaljert informasjon som mulig. Dette hjelper
              oss å identifisere og løse problemet raskere.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Vi ser frem til å høre fra deg!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUsPage;

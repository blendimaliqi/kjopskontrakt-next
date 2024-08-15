import React from "react";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage: NextPage = () => {
  const faqs = [
    {
      question: "Hva er Kjøpskontrakt-bil Generator?",
      answer:
        "Kjøpskontrakt-bil Generator er en online tjeneste som hjelper deg med å lage en skreddersydd kjøpskontrakt for bil. Ved å fylle ut et enkelt skjema, genererer tjenesten en juridisk formulert kontrakt tilpasset ditt bilkjøp eller -salg.",
    },
    {
      question: "Er kontraktene som genereres juridisk bindende?",
      answer:
        "Kontraktene som genereres er basert på standard juridiske formuleringer og er ment å være juridisk bindende. Imidlertid anbefaler vi at du gjennomgår kontrakten nøye og konsulterer en advokat hvis du er usikker på noe eller har spesielle behov.",
    },
    {
      question: "Hvor mye koster det å bruke tjenesten?",
      answer:
        "Prisen for å bruke tjenesten er kr 9.90.- per generert kontrakt. Du betaler kun når du er fornøyd med kontrakten og ønsker å laste den ned.",
    },
    {
      question: "Hvordan betaler jeg for tjenesten?",
      answer:
        "Vi aksepterer betaling via kredittkort. Betalingen behandles sikkert gjennom vår betalingspartner.",
    },
    {
      question: "Lagrer dere informasjonen jeg oppgir?",
      answer:
        "All informasjon du oppgir behandles utelukkende i din nettleser. Kontrakten genereres lokalt på din enhet, og ingen data fra kontrakten sendes til eller lagres på våre servere. Dette sikrer fullstendig personvern og konfidensialitet for dine data.",
    },
    {
      question: "Kan jeg redigere kontrakten etter at den er generert?",
      answer:
        "Når kontrakten er generert som PDF, kan innholdet ikke lenger endres. Du har mulighet til å gjøre alle ønskede endringer før du klikker på 'Generer'. Hvis du trenger endringer etter generering, må du starte prosessen på nytt og lage en ny kontrakt.",
    },
    {
      question: "Hva hvis jeg trenger hjelp eller har spørsmål underveis?",
      answer:
        "Hvis du har spørsmål eller trenger assistanse, kan du når som helst kontakte meg på blendi.maliqi93@gmail.com. Jeg vil svare så raskt som mulig.",
    },
    {
      question:
        "Er tjenesten tilgjengelig for både privatpersoner og bedrifter?",
      answer:
        "Ja, tjenesten kan brukes av både privatpersoner og bedrifter. Kontrakten tilpasses basert på informasjonen du oppgir.",
    },
    {
      question:
        "Hva gjør jeg hvis jeg oppdager en feil i den genererte kontrakten?",
      answer:
        "Hvis du oppdager noen feil eller uoverensstemmelser i den genererte kontrakten, vennligst kontakt meg umiddelbart på blendi.maliqi93@gmail.com. Jeg vil hjelpe deg med å rette opp feilen og generere en ny kontrakt uten ekstra kostnad.",
    },
    {
      question: "Kan jeg bruke tjenesten på mobil eller nettbrett?",
      answer:
        "Ja, tjenesten er fullt responsiv og kan brukes på alle enheter, inkludert smarttelefoner og nettbrett.",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ofte stilte spørsmål
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;

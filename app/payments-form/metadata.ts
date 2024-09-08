import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betalingsside | Kjøpskontrakt-bil Generator",
  description:
    "Sikker og enkel betaling for å generere kjøpskontrakter for bil. Fyll på din konto og start med å lage profesjonelle kontrakter.",
  keywords: "betaling, kjøpskontrakt, bil, generator, sikker betaling, stripe",
  openGraph: {
    title: "Betalingsside | Kjøpskontrakt-bil Generator",
    description: "Sikker og enkel betaling for Kjøpskontrakt-bil Generator.",
    type: "website",
    url: "https://kjopskontrakt.no/payments-form",
  },
  robots: "noindex, nofollow", // Consider not indexing the payment page
};

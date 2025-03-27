import { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Kjøpskontrakt for bil | Lag en juridisk gyldig kjøpskontrakt enkelt",
  description:
    "Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for kjøp og salg av bil med vår digitale tjeneste.",
  alternates: {
    canonical: "https://kjopskontrakt.no",
  },
};

export default function Page() {
  return <ClientPage />;
}

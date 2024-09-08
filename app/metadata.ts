import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Kjøpskontrakt-bil Generator",
    template: "%s | Kjøpskontrakt-bil Generator",
  },
  description:
    "Generer profesjonelle og juridisk bindende kjøpskontrakter for bil enkelt og raskt.",
  keywords: "kjøpskontrakt, bil, generator, bruktbil, kontrakt",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "https://kjopskontrakt.no",
    siteName: "Kjøpskontrakt-bil Generator",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

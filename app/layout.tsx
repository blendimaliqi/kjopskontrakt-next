import "./globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import Title from "@/components/Title";
import DropdownProfile from "@/components/DropDownProfile";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Kjøpskontrakt | Enkelt verktøy for bilkjøpskontrakter i Norge",
  description:
    "Lag profesjonelle kjøpskontrakter for bil enkelt og raskt. Sikre trygge biltransaksjoner i Norge med vår brukervennlige tjeneste.",
  keywords:
    "kjøpskontrakt, bilkjøp, bilsalg, kontrakt, Norge, juridisk dokument",
  openGraph: {
    title: "Kjøpskontrakt - Profesjonelle bilkjøpskontrakter",
    description:
      "Lag enkelt og raskt juridisk korrekte kjøpskontrakter for bil i Norge.",
    type: "website",
    url: "https://kjopskontrakt.no",
    images: [
      {
        url: "/logo_nobg.png",
        width: 1200,
        height: 630,
        alt: "Kjøpskontrakt logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kjøpskontrakt for bilkjøp i Norge",
    description: "Enkel og sikker måte å lage kjøpskontrakter for bil på.",
    images: ["/logo_nobg.png"],
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", url: "/logo_nobg.png", type: "image/png", sizes: "32x32" },
    { rel: "icon", url: "/logo_nobg.png", type: "image/png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/logo_nobg.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className="h-full">
      <body className="flex min-h-screen flex-col">
        <StructuredData />
        <Providers>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <Title className="text-xl" />
              <div className="flex items-center space-x-4">
                <DropdownProfile />
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="container py-6">{children}</div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

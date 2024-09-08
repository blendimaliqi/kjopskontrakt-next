import { Metadata } from "next";
import { Providers } from "./providers";
import Title from "@/components/Title";
import DropdownProfile from "@/components/DropDownProfile";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

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

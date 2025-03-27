import { Metadata } from "next";
import { Providers } from "./providers";
import Title from "@/components/Title";
import DropdownProfile from "@/components/DropDownProfile";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://kjopskontrakt.no"),
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kjopskontrakt.no",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
    <html lang="nb" className="h-full">
      <body className="flex min-h-screen flex-col">
        <StructuredData />
        <Providers>
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Title className="text-xl" />
                <nav className="hidden md:flex items-center space-x-8">
                  <a
                    href="/"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Hjem
                  </a>
                  <a
                    href="/contract"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Kjøpskontrakt
                  </a>
                  <a
                    href="/#hvordan-det-fungerer"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Hvordan det fungerer
                  </a>
                  <a
                    href="/#priser"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Priser
                  </a>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Kontakt
                  </a>
                </nav>
                <div className="flex items-center space-x-4">
                  <DropdownProfile />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

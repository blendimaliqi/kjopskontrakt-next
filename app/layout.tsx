import "./globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import Title from "@/components/Title";
import DropdownProfile from "@/components/DropDownProfile";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kjøpskontrakt",
  description: "A custom form for purchase contracts",
  icons: [
    { rel: "icon", url: "/logo_nobg.png", sizes: "32x32" },
    { rel: "icon", url: "/logo_nobg.png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/logo_nobg.png", sizes: "180x180" },
    { rel: "shortcut icon", url: "/logo_nobg.png" },
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

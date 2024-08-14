import { Providers } from "./providers";
import { Metadata } from "next";
import Title from "@/components/Title";
import DropdownMenuDemo from "@/components/DropDownProfile";

export const metadata: Metadata = {
  title: "Kjøpskontrakt",
  description: "A custom form for purchase contracts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="bg-gray-100">
        <Providers>
          <header className="bg-white shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex-shrink-0">
                  <Title className="text-xl" />
                </div>
                <div className="flex-shrink-0">
                  <DropdownMenuDemo />
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        </Providers>
      </body>
    </html>
  );
}

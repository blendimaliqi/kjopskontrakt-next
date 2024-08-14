import { Providers } from "./providers";
import styles from "./styles.module.css";
import { Metadata } from "next";
import UserMenu from "@/components/UserMenu";
import Title from "@/components/Title";

export const metadata: Metadata = {
  title: "Comprehensive Custom Form",
  description: "A custom form for purchase contracts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.container}>
        <Providers>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: "760px",
                padding: "0 20px",
              }}
            >
              <Title />
              <header className={styles.header}>
                <UserMenu />
              </header>
            </div>
          </div>
          <main className={styles.main}>{children}</main>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        </Providers>
      </body>
    </html>
  );
}

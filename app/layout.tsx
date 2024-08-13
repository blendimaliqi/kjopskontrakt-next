import styles from "./styles.module.css";
import { Metadata } from "next";

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
        <main className={styles.main}>{children}</main>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </body>
    </html>
  );
}

"use client";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h2>Kjøpskontrakt</h2>
        <PurchaseContractForm />
      </div>
    </main>
  );
}

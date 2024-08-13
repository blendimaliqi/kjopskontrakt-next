"use client";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import styles from "../styles/Home.module.css";
import AuthButton from "@/components/AuthButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h2 style={{ textAlign: "center" }}>Kjøpskontrakt</h2>
        <AuthButton />
        {session && session.user && <PurchaseContractForm />}
      </div>
    </main>
  );
}

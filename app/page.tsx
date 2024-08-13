"use client";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import styles from "../styles/Home.module.css";
import AuthButton from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import SignUp from "./auth/signup/page";

export default function Home() {
  const { data: session } = useSession();

  session && console.log(session);
  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h2 style={{ textAlign: "center" }}>Kjøpskontrakt</h2>
        {/* <AuthButton /> */}
        <SignUp />
        {session &&
          session.user &&
          session.user.email === "blendi.maliqi93@gmail.com" && (
            <PurchaseContractForm />
          )}
      </div>
    </main>
  );
}

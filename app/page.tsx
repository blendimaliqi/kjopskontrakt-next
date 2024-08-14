"use client";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import { useSession } from "next-auth/react";
import "../app/globals.css";

export default function Home() {
  const { data: session } = useSession();

  session && console.log(session);
  return (
    <main>
      <div>
        {session && session.user && session.user.email && (
          <div>
            <PurchaseContractForm />
          </div>
        )}
      </div>
    </main>
  );
}

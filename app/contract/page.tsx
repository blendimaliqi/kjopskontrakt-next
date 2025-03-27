import { Metadata } from "next";
import ContractClient from "./client";

export const metadata: Metadata = {
  title: "Kjøpskontrakt for bil | Fyll ut og generer PDF",
  description:
    "Fyll ut vår kjøpskontrakt for bil og generer en profesjonell PDF dokument. Lovlig bindende og enkel å bruke.",
};

export default function ContractPage() {
  return <ContractClient />;
}

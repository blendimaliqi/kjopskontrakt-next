"use client";

import React from "react";
import { useSession } from "next-auth/react";
import PurchaseContractForm from "@/components/PurchaseContractForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, AlertCircle, Car } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContractClient() {
  const { data: session } = useSession();
  const isLoggedIn = session && session.user && session.user.email;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5">
        <Car className="w-96 h-96 text-blue-500" />
      </div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 opacity-5 transform rotate-180">
        <Car className="w-96 h-96 text-blue-500" />
      </div>

      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div className="text-center mb-8" variants={fadeIn}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Kjøpskontrakt for bil
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fyll ut skjemaet under for å generere en profesjonell og juridisk
            bindende kjøpskontrakt
          </p>
          {!isLoggedIn && (
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span>
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Logg inn
                </Link>{" "}
                eller{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  registrer deg
                </Link>{" "}
                for å generere PDF
              </span>
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeIn}>
          <PurchaseContractForm />
        </motion.div>
      </motion.div>
    </div>
  );
}

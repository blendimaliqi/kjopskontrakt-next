"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  FileText,
  CreditCard,
  RefreshCcw,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PricingPageContent = () => {
  const { data: session } = useSession();

  return (
    <motion.div
      className="flex flex-col justify-center items-center p-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <div className="max-w-7xl w-full space-y-10">
        <motion.header className="text-center space-y-4" variants={fadeIn}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Enkel og fleksibel prising
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Betal kun for det du bruker - ingen abonnement eller skjulte gebyrer
          </p>
        </motion.header>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={fadeIn}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - pricing details */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
                  Forbruksbasert
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  9,90 kr per PDF
                </h3>
                <p className="text-gray-600 mb-8">
                  Sett inn valgfritt beløp og betal kun for de kontraktene du
                  genererer
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Ingen månedlige kostnader",
                    "Ubegrenset lagringstid",
                    "Juridisk gyldige kontrakter",
                    "PDF-er tilgjengelig umiddelbart",
                    "Enkel betalingsløsning",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                {!session ? (
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link href="/auth/signup">
                      Kom i gang <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link href="/payments-form">
                      Gå til Min Konto <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right side - How it works */}
            <div className="bg-gray-50 p-8 md:p-10">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Slik fungerer det:
              </h4>

              <ol className="space-y-6">
                {[
                  {
                    title: "Registrer deg",
                    desc: "Opprett en konto for å komme i gang",
                    icon: Wallet,
                  },
                  {
                    title: "Sett inn penger",
                    desc: "Fyll på kontoen din med ønsket beløp",
                    icon: CreditCard,
                  },
                  {
                    title: "Generer PDF-er",
                    desc: "9,90 kr trekkes per generert kontrakt",
                    icon: FileText,
                  },
                  {
                    title: "Fyll på ved behov",
                    desc: "Legg til mer penger når du trenger det",
                    icon: RefreshCcw,
                  },
                ].map((step, i) => (
                  <li key={i} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                        <step.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {step.title}
                      </h5>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingPageContent;

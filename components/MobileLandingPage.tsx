import React from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  BookOpen,
  Users,
  FileText,
  Wallet,
  CreditCard,
  RefreshCcw,
  Check,
  ArrowRight,
  Car,
} from "lucide-react";
import Link from "next/link";
import { generateDemoPDF } from "@/utils/demoPDF";
import { motion } from "framer-motion";

interface MobileLandingPageProps {
  isLoggedIn: boolean;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MobileLandingPage: React.FC<MobileLandingPageProps> = ({
  isLoggedIn,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <motion.header
        className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 text-center"
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
        <motion.div variants={fadeIn}>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Kjøpskontrakt for bil
          </h1>
          <p className="text-gray-700 text-sm mb-4">
            Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for bil
          </p>
          {!isLoggedIn ? (
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
              <Link href="/contract">
                Lag en kjøpskontrakt <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.header>

      <main className="flex-grow p-4 space-y-8">
        {/* Features */}
        <motion.section
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.h2
            className="text-xl font-semibold text-gray-900"
            variants={fadeIn}
          >
            Hvorfor velge oss?
          </motion.h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: Shield,
                title: "Sikker kontrakt",
                text: "Lovlig bindende avtale",
              },
              {
                icon: Zap,
                title: "Rask utfylling",
                text: "Spar tid og hodebry",
              },
              {
                icon: BookOpen,
                title: "Norsk lovverk",
                text: "Tilpasset norske regler",
              },
              {
                icon: Users,
                title: "For alle",
                text: "Privatpersoner og bedrifter",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm"
                variants={fadeIn}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Demo PDF */}
        <motion.section
          className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Se hvordan det fungerer
          </h2>
          <p className="text-sm text-gray-700">
            Prøv vår PDF-generator og se den ferdige kontrakten
          </p>
          <Button
            onClick={() => generateDemoPDF()}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generer Demo PDF
          </Button>
        </motion.section>

        {!isLoggedIn && (
          <>
            {/* How it works */}
            <motion.section
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.h2
                className="text-xl font-semibold text-gray-900"
                variants={fadeIn}
              >
                Slik fungerer det
              </motion.h2>
              <div className="space-y-3">
                {[
                  {
                    number: "1",
                    title: "Fyll ut skjema",
                    text: "Legg inn all relevant informasjon",
                  },
                  {
                    number: "2",
                    title: "Generer PDF",
                    text: "Få en profesjonell kontrakt",
                  },
                  {
                    number: "3",
                    title: "Skriv under",
                    text: "Gjør kontrakten juridisk bindende",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4"
                    variants={fadeIn}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Pricing */}
            <motion.section
              className="bg-white rounded-xl shadow p-6 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-2">
                Forbruksbasert
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                9,90 kr per PDF
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Betal kun for det du bruker - ingen abonnement eller skjulte
                gebyrer
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Ingen månedlige kostnader",
                  "Ubegrenset lagringstid",
                  "Juridisk gyldige kontrakter",
                  "PDF-er tilgjengelig umiddelbart",
                  "Enkel betalingsløsning",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </>
        )}
      </main>

      {!isLoggedIn && (
        <footer className="bg-white p-6 shadow-inner space-y-3">
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/auth/signup">
              Registrer deg <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Link href="/auth/signin">Logg inn</Link>
          </Button>
        </footer>
      )}
    </div>
  );
};

export default MobileLandingPage;

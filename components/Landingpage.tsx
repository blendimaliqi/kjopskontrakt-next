import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  Users,
  FileText,
  CheckCircle,
  Car,
} from "lucide-react";
import Link from "next/link";
import PricingPageContent from "./PricingPageContent";
import { generateDemoPDF } from "@/utils/demoPDF";
import { motion } from "framer-motion";

interface LandingPageContentProps {
  isLoggedIn: boolean;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPageContent: React.FC<LandingPageContentProps> = ({
  isLoggedIn,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
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
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center space-y-6" variants={fadeIn}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Kjøpskontrakt for bil
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Lag enkelt og raskt en juridisk gyldig kjøpskontrakt for bil med
              vår brukervennlige løsning
            </p>
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/auth/signup">
                    Kom i gang <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-blue-300 hover:bg-blue-50"
                >
                  <Link href="/auth/signin">Logg inn</Link>
                </Button>
              </div>
            )}
            {isLoggedIn && (
              <div className="flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/contract">
                    Lag en kjøpskontrakt <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <Car className="w-96 h-96 text-blue-500" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
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
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900">
              Enkel, rask og sikker løsning
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Vår kjøpskontrakt-generator gir deg alt du trenger for et trygt
              bilkjøp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Sikker kontrakt",
                text: "Lovlig bindende kontrakt som beskytter både kjøper og selger",
              },
              {
                icon: Zap,
                title: "Rask utfylling",
                text: "Intuitivt grensesnitt som sparer deg for tid og hodebry",
              },
              {
                icon: BookOpen,
                title: "Norske regler",
                text: "Tilpasset norske lover og regler for bruktbilsalg",
              },
              {
                icon: Users,
                title: "For alle",
                text: "Perfekt for privatpersoner og bedrifter",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:shadow-md transition-shadow"
                variants={fadeIn}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Demo PDF Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-indigo-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Se hvordan det fungerer
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Prøv vår PDF-generator og se hvordan den ferdige kontrakten vil se
              ut
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => generateDemoPDF()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                Generer Demo PDF
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {!isLoggedIn && (
        <>
          {/* How It Works Section */}
          <motion.section
            id="hvordan-det-fungerer"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
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
            <div className="max-w-7xl mx-auto">
              <motion.div className="text-center mb-16" variants={fadeIn}>
                <h2 className="text-3xl font-bold text-gray-900">
                  Slik fungerer det
                </h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                  Tre enkle steg for å lage din profesjonelle kjøpskontrakt
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    number: "1",
                    title: "Fyll ut skjema",
                    text: "Legg inn all relevant informasjon om kjøper, selger og bilen",
                  },
                  {
                    number: "2",
                    title: "Generer PDF",
                    text: "Få en profesjonell kontrakt generert automatisk basert på dine opplysninger",
                  },
                  {
                    number: "3",
                    title: "Skriv under",
                    text: "Skriv ut og signer kontrakten for å gjøre den juridisk bindende",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    variants={fadeIn}
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </>
      )}

      {/* Pricing Section */}
      <div id="priser" className="bg-gray-50 py-16">
        <PricingPageContent />
      </div>

      {/* CTA Section */}
      {!isLoggedIn && (
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Klar til å komme i gang?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Registrer deg i dag og få tilgang til vår kjøpskontrakt-generator
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/auth/signup">
                  Registrer deg <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/auth/signin">Logg inn</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default LandingPageContent;

"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  User,
  AlertCircle,
  MailIcon,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/new-password`,
      }
    );

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage(
        "Tilbakestillingslenke for passord er sendt til din e-post. Vennligst sjekk innboksen din."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      <motion.div
        className="max-w-md w-full"
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Tilbakestill passord
            </span>
          </h1>
          <p className="mt-3 text-gray-600">
            Skriv inn din e-postadresse for å motta en tilbakestillingslenke
          </p>
        </motion.div>

        <motion.div variants={fadeIn}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <Alert
                  variant="default"
                  className="mb-6 bg-green-50 border-green-200"
                >
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
                <Link href="/auth/signin">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Gå til innlogging <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-post
                  </Label>
                  <div className="mt-1 relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din.epost@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sender..." : "Send tilbakestillingslenke"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            )}

            {!message && (
              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">eller</span>
                  </div>
                </div>

                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tilbake til innlogging
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-500"
          variants={fadeIn}
        >
          <p>
            Har du ikke en konto?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-800"
            >
              Registrer deg
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

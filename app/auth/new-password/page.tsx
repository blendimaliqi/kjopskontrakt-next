"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Lock,
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

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if the user is in a valid password reset state
    const checkResetState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError(
          "Ugyldig eller utløpt tilbakestillingskobling. Vennligst be om en ny tilbakestillingskobling."
        );
      }
    };

    checkResetState();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passordene stemmer ikke overens.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Passordet ditt har blitt oppdatert. Du vil bli omdirigert til innloggingssiden."
      );
      setTimeout(() => router.push("/auth/signin"), 3000);
    } catch (error) {
      setError("Kunne ikke oppdatere passordet. Vennligst prøv igjen.");
    } finally {
      setIsLoading(false);
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
              Angi nytt passord
            </span>
          </h1>
          <p className="mt-3 text-gray-600">
            Opprett et nytt, sikkert passord for kontoen din
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
                <div className="text-sm text-gray-600 mt-2">
                  Omdirigerer til innloggingssiden...
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <Label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nytt passord
                  </Label>
                  <div className="mt-1 relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bekreft nytt passord
                  </Label>
                  <div className="mt-1 relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
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
                    {isLoading ? "Oppdaterer..." : "Oppdater passord"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            )}

            {!message && (
              <div className="mt-6 flex flex-col space-y-3">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Lock
                        className="h-5 w-5 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Tips for et sterkt passord
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Bruk minst 8 tegn</li>
                          <li>Inkluder tall og spesialtegn</li>
                          <li>Blanding av store og små bokstaver</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-500"
          variants={fadeIn}
        >
          <p>
            Ved spørsmål, kontakt vår{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              kundeservice
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

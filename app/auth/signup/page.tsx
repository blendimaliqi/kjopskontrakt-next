"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/utils/supabase";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  User,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const router = useRouter();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passordene samsvarer ikke.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword) {
      validatePasswords();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setIsRateLimited(false);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/signup-confirmation`,
      },
    });

    if (signUpError) {
      setIsLoading(false);
      if (signUpError.message.includes("Email rate limit exceeded")) {
        setIsRateLimited(true);
      } else {
        setError(signUpError.message);
      }
    } else {
      // Attempt to sign in automatically after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        setIsRegistered(true); // Fall back to registration success screen
      } else {
        router.push("/contract"); // Redirect to contract page on successful auto-login
      }
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          className="max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Registrering vellykket
              </h2>
            </div>
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Takk for at du registrerte deg! Vennligst sjekk e-posten din for
                en bekreftelseslink. Etter at du har bekreftet e-postadressen
                din, kan du logge inn.
              </AlertDescription>
            </Alert>
            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Gå til innlogging <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isRateLimited) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          className="max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={40} className="text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Hastighetsbegrensning
              </h2>
            </div>
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                Beklager, vi har nådd grensen for e-postregistrering. Dette er
                vanligvis et midlertidig problem. Vennligst prøv igjen senere
                eller kontakt support hvis problemet vedvarer.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setIsRateLimited(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Prøv igjen <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
              Registrer deg
            </span>
          </h1>
          <p className="mt-3 text-gray-600">
            Opprett en konto for å få tilgang til kjøpskontrakt-tjenesten
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
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-post
                </Label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
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
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Passord
                </Label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  Bekreft passord
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
                    onBlur={handleConfirmPasswordBlur}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {passwordError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Registrerer..." : "Registrer deg"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

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
                  Logg inn med eksisterende konto
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-500"
          variants={fadeIn}
        >
          <p>
            Ved å registrere deg godtar du våre{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-600 hover:text-blue-800"
            >
              vilkår
            </Link>{" "}
            og{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-800"
            >
              personvernregler
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

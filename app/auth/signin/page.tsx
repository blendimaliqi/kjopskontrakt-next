"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { ArrowRight, User, KeyRound, AlertCircle } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Ugyldig e-post eller passord");
    } else {
      router.push("/contract");
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
              Logg Inn
            </span>
          </h1>
          <p className="mt-3 text-gray-600">
            Logg inn for å få tilgang til kjøpskontrakt-tjenesten
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Logger inn..." : "Logg inn"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
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

              <div className="flex flex-col space-y-4">
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Registrer deg
                  </Button>
                </Link>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Glemt passord?
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-500"
          variants={fadeIn}
        >
          <p>
            Ved å logge inn godtar du våre{" "}
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

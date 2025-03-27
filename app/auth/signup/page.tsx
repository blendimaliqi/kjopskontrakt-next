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
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <Alert className="mb-4">
          <AlertDescription>
            Takk for at du registrerte deg! Vennligst sjekk e-posten din for en
            bekreftelseslink. Etter at du har bekreftet e-postadressen din, kan
            du logge inn.
          </AlertDescription>
        </Alert>
        <Link href="/auth/signin">
          <Button className="w-full">Gå til innlogging</Button>
        </Link>
      </div>
    );
  }

  if (isRateLimited) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <Alert className="mb-4">
          <AlertDescription>
            Beklager, vi har nådd grensen for e-postregistrering. Dette er
            vanligvis et midlertidig problem. Vennligst prøv igjen senere eller
            kontakt support hvis problemet vedvarer.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setIsRateLimited(false)} className="w-full">
          Prøv igjen
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registrer deg</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <Label htmlFor="email">E-post</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-post"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Passord</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Bekreft passord</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            placeholder="Bekreft passord"
            required
          />
        </div>
        {passwordError && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registrerer..." : "Registrer deg"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/auth/signin" className="text-blue-600 hover:underline">
          Har du allerede en konto? Logg inn
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Angi nytt passord</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert variant="default" className="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <Label htmlFor="newPassword">Nytt passord</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Skriv inn nytt passord"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Bekreft nytt passord</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Bekreft nytt passord"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Oppdaterer..." : "Oppdater passord"}
        </Button>
      </form>
    </div>
  );
}

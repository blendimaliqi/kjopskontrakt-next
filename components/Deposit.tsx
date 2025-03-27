import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

function Deposit() {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeposit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/account/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "En ukjent feil oppstod");
      }

      setSuccess(`Innskudd vellykket! Ny saldo: ${data.balance.toFixed(2)} kr`);
      setAmount(""); // Reset amount after successful deposit
    } catch (error) {
      console.error("Innskuddsfeil:", error);
      setError(`Innskudd mislyktes: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Gjør et innskudd</CardTitle>
        <CardDescription>
          Skriv inn beløpet du ønsker å sette inn på kontoen din.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Skriv inn beløp"
            className="flex-grow"
          />
          <Button
            onClick={handleDeposit}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Behandler
              </>
            ) : (
              "Sett inn"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Feil</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default">
            <AlertTitle>Vellykket</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}

export default Deposit;

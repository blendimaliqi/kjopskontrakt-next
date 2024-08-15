import React, { useState, FormEvent } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: true, // Hide the postal code field for Norwegian users
};

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      setError("Stripe har ikke lastet inn ennå.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create a Payment Intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(amount) }), // Amount in smallest currency unit (øre)
      });

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);

      if (cardElement) {
        // Step 2: Confirm the Card Payment using the client secret
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (result.error) {
          throw new Error(result.error.message || "Betaling mislyktes");
        } else {
          if (result.paymentIntent.status === "succeeded") {
            // Step 3: Update the deposit after successful payment
            const depositResponse = await fetch("/api/account/deposit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: parseFloat(amount) }), // Use the actual amount paid
            });

            const depositData = await depositResponse.json();

            if (!depositResponse.ok) {
              throw new Error(
                depositData.error || "Feil ved oppdatering av innskudd"
              );
            }

            setSuccess(
              `Betaling vellykket! Ny saldo: ${depositData.balance.toFixed(
                2
              )} kr`
            );
            setAmount(""); // Reset the amount input
          }
        }
      }
    } catch (error: any) {
      setError(error.message || "En ukjent feil oppstod");
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
        <CardTitle>Betal med Stripe</CardTitle>
        <CardDescription>
          Skriv inn beløpet du ønsker å betale og fullfør betalingen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Skriv inn beløp"
            className="flex-grow"
          />
          <CardElement options={cardElementOptions} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Behandler
            </>
          ) : (
            "Betal"
          )}
        </Button>
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
};

export default PaymentForm;

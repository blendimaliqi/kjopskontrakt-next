"use client";
import React, { useState, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  HelpCircle,
  LogIn,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

interface PaymentFormProps {
  onSuccess: (balance: number) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<string>("");
  const [cardholderName, setCardholderName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      setError("Stripe er ikke lastet ennå.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });

      const { clientSecret } = await response.json();

      const cardNumber = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);

      if (!cardNumber || !cardExpiry || !cardCvc) {
        throw new Error("Kortelementene ble ikke funnet.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: cardholderName,
            address: {
              country: "NO",
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Betalingen mislyktes");
      } else if (result.paymentIntent.status === "succeeded") {
        const depositResponse = await fetch("/api/account/deposit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseFloat(amount) }),
        });

        const depositData = await depositResponse.json();

        if (!depositResponse.ok) {
          throw new Error(
            depositData.error || "Feil ved oppdatering av innskudd"
          );
        }

        setSuccess(
          `Betalingen var vellykket! Ny saldo: ${depositData.balance.toFixed(
            2
          )} NOK`
        );
        setAmount("");
        onSuccess(depositData.balance);
      }
    } catch (error: any) {
      setError(error.message || "En ukjent feil oppstod");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="deposit-amount">Innskuddsbeløp (NOK)</Label>
        <Input
          id="deposit-amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Skriv inn innskuddsbeløp"
          required
        />
      </div>
      <div>
        <Label htmlFor="card-number">Kortnummer</Label>
        <div className="mt-1 p-3 border rounded-md">
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-expiry">Utløpsdato</Label>
          <div className="mt-1 p-3 border rounded-md">
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        <div>
          <Label htmlFor="card-cvc">CVC</Label>
          <div className="mt-1 p-3 border rounded-md">
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="cardholder-name">Kortholders navn</Label>
        <Input
          id="cardholder-name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Fullt navn på kortet"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !stripe}
        className="w-full bg-[#1a1f36] text-white"
      >
        {isLoading ? "Behandler..." : "Legg til beløp"}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feil</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Suksess</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

interface SuccessCardProps {
  balance: number;
  onReset: () => void;
}

const SuccessCard: React.FC<SuccessCardProps> = ({ balance, onReset }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center">
        <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
        <h3 className="text-lg font-semibold">Betaling Vellykket</h3>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-lg">
        Din betaling ble behandlet vellykket. Din nye saldo er:
      </p>
      <p className="text-2xl font-bold mt-2">{balance.toFixed(2)} NOK</p>
    </CardContent>
    <CardFooter>
      <div className="flex space-x-4">
        <Button asChild variant="outline">
          <Link href="/" onClick={onReset}>
            Tilbake
          </Link>
        </Button>
      </div>
    </CardFooter>
  </Card>
);

const LoginMessage: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <LogIn className="mr-2" />
        Innlogging påkrevd
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>Du må være logget inn for å få tilgang til betalingssiden.</p>
    </CardContent>
    <CardFooter>
      <Button asChild>
        <Link href="/auth/signin">Gå til innlogging</Link>
      </Button>
    </CardFooter>
  </Card>
);

const PaymentPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

  const handlePaymentSuccess = (balance: number) => {
    setPaymentSuccess(true);
    setNewBalance(balance);
  };

  const handleReset = () => {
    setPaymentSuccess(false);
    setNewBalance(0);
  };

  if (status === "loading") {
    return <div>Laster...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <LoginMessage />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <div className="">
        <div className="md:col-span-2">
          {paymentSuccess ? (
            <SuccessCard balance={newBalance} onReset={handleReset} />
          ) : (
            <Card className="shadow-lg">
              <CardHeader className="p-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <Shield className="mr-3 h-8 w-8 text-blue-600" />
                    <CardTitle className="text-2xl font-bold">
                      Trygg og enkel betaling
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="">
                <Elements stripe={stripePromise}>
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </Elements>
              </CardContent>
              <CardFooter className="text-sm text-gray-600 justify-between bg-gray-50 border-t p-4">
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  <span> Kryptert og beskyttet av Stripe</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <a
                      href="/terms-and-conditions"
                      className="underline mr-2 hover:text-gray-700"
                    >
                      Vilkår
                    </a>
                    <a
                      href="/privacy-policy"
                      className="underline hover:text-gray-700"
                    >
                      Personvern
                    </a>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <div className="flex justify-center space-x-4 mb-2">
              <img src="/stripe.png" alt="Stripe" className="h-7" />
              <img src="/visa2.png" alt="Visa" className="h-7" />
              <img src="/mastercard.png" alt="Mastercard" className="h-7" />
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Hvilke betalingsmetoder aksepteres?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Vi aksepterer alle større kredittkort, inkludert Visa,
                Mastercard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Er mine betalingsopplysninger trygge?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Ja, vi bruker{" "}
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe
                </a>{" "}
                for å prosessere betalinger, som er en av de mest sikre
                betalingsplattformene tilgjengelig.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Hvordan kan jeg få hjelp?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Hvis du trenger hjelp, kan du kontakte vår kundeservice på
                support@kjopskontrakt.no
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

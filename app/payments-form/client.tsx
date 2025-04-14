"use client";
import React, { useState, FormEvent, useEffect } from "react";
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
  CardDescription,
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
  Plus,
  ArrowLeft,
  History,
  Wallet,
  RefreshCw,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel }) => {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<string>("");
  const [cardholderName, setCardholderName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

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

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 40) {
      setError("Minimum innskuddsbeløp er 40 NOK");
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

      // Real-time validation for minimum amount
      const numValue = parseFloat(value);
      if (value && !isNaN(numValue)) {
        if (numValue < 40) {
          setAmountError("Beløpet må være minst 40 NOK");
        } else {
          setAmountError(null);
        }
      } else {
        setAmountError(null);
      }
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
          className={amountError ? "border-red-500" : ""}
          required
        />
        {amountError ? (
          <p className="text-xs text-red-500 mt-1">{amountError}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Minimum innskuddsbeløp: 40 NOK
          </p>
        )}
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
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            console.log("Cancel button clicked");
            onCancel();
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !stripe || amountError !== null || !amount}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Behandler..." : "Legg til beløp"}
        </Button>
      </div>
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
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake til oversikt
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

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "deposit" | "usage";
  description: string;
}

const Dashboard: React.FC<{
  balance: number;
  onAddFunds: () => void;
  refreshBalance: () => void;
}> = ({ balance, onAddFunds, refreshBalance }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null
  );
  const [visibleTransactions, setVisibleTransactions] = useState(5);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    setTransactionError(null);
    try {
      const response = await fetch("/api/account/transactions");

      if (!response.ok) {
        throw new Error("Kunne ikke hente transaksjonshistorikk");
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactionError("Kunne ikke laste inn transaksjonshistorikk");
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const toggleTransaction = (id: string) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const loadMoreTransactions = () => {
    setVisibleTransactions((prev) => prev + 5);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-blue-900">Din Saldo</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                refreshBalance();
                fetchTransactions();
              }}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-4">
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {balance.toFixed(2)} NOK
            </div>
            <p className="text-sm text-blue-600 mb-5">
              Nok til {Math.floor(balance / 9.9)} kontrakter
            </p>
            <Button
              onClick={onAddFunds}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-5 rounded-lg shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" /> Legg til saldo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="mt-8">
        <TabsList className="grid grid-cols-2 mb-4 rounded-lg">
          <TabsTrigger value="transactions" className="flex items-center">
            <History className="mr-2 h-4 w-4" /> Transaksjoner
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" /> Informasjon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="rounded-xl overflow-hidden shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">
                Dine siste transaksjoner
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingTransactions ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Laster inn transaksjoner...</p>
                </div>
              ) : transactionError ? (
                <div className="p-4 text-center text-red-500">
                  {transactionError}
                </div>
              ) : (
                <div>
                  <div className="divide-y max-h-[300px] overflow-y-auto">
                    {transactions.length > 0 ? (
                      transactions
                        .slice(0, visibleTransactions)
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleTransaction(transaction.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {transaction.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("nb-NO")}
                                </p>
                              </div>
                              <div
                                className={`font-semibold ${
                                  transaction.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount.toFixed(2)} NOK
                              </div>
                            </div>
                            {expandedTransaction === transaction.id && (
                              <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                                <p>
                                  <strong>Transaksjonsdetaljer:</strong>
                                </p>
                                <p>
                                  Dato:{" "}
                                  {new Date(transaction.date).toLocaleString(
                                    "nb-NO"
                                  )}
                                </p>
                                <p>
                                  Type:{" "}
                                  {transaction.type === "deposit"
                                    ? "Innskudd"
                                    : "Bruk"}
                                </p>
                                <p>
                                  Beløp: {transaction.amount.toFixed(2)} NOK
                                </p>
                                <p>Transaksjon ID: {transaction.id}</p>
                              </div>
                            )}
                          </div>
                        ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Ingen transaksjoner ennå
                      </div>
                    )}
                  </div>
                  {transactions.length > visibleTransactions && (
                    <div className="p-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMoreTransactions}
                      >
                        Vis flere transaksjoner
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Priser og informasjon</CardTitle>
              <CardDescription>
                Her finner du viktig informasjon om våre priser og vilkår
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Priser:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hver kjøpskontrakt koster 9,90 NOK</li>
                  <li>
                    Du kan fylle på kontoen din med valgfritt beløp fra 40 NOK
                    og oppover
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vilkår:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Beløp som er lagt til i din saldo vil ikke bli refundert
                  </li>
                  <li>
                    Kjøpskontrakter kan kun genereres hvis du har tilstrekkelig
                    saldo
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newBalance, setNewBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBalance();
    }
  }, [status]);

  const fetchBalance = async (retryCount = 0) => {
    setIsLoadingBalance(true);
    setBalanceError(null);
    try {
      const response = await fetch("/api/account/balance", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 && retryCount < 2) {
          console.log(`Auth error, retrying... (${retryCount + 1})`);
          setTimeout(() => fetchBalance(retryCount + 1), 1000);
          return;
        }
        throw new Error("Kunne ikke hente saldo");
      }

      const data = await response.json();
      setCurrentBalance(data.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceError("Kunne ikke laste inn saldo");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handlePaymentSuccess = (balance: number) => {
    setPaymentSuccess(true);
    setNewBalance(balance);
    setCurrentBalance(balance);
  };

  const handleReset = () => {
    setPaymentSuccess(false);
    setShowPaymentForm(false);
  };

  const handleBackToDashboard = () => {
    setShowPaymentForm(false);
    setPaymentSuccess(false);
  };

  if (status === "loading" || isLoadingBalance) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster...</p>
        </div>
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="container mx-auto p-6 max-w-xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feil</AlertTitle>
          <AlertDescription>{balanceError}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchBalance()} className="mt-4">
          Prøv igjen
        </Button>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <LoginMessage />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto p-6 max-w-xl">
        <SuccessCard balance={newBalance} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      {!showPaymentForm ? (
        <Dashboard
          balance={currentBalance}
          onAddFunds={() => setShowPaymentForm(true)}
          refreshBalance={fetchBalance}
        />
      ) : (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">
              Profesjonelle kjøpskontrakter
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ved å fylle på saldo får du umiddelbar tilgang til å generere
              profesjonelle kjøpskontrakter når du trenger dem. Hver kontrakt
              koster kun 9,90 NOK, og du kan generere så mange du trenger når du
              har saldo tilgjengelig.
            </p>
          </div>

          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <Shield className="mr-3 h-9 w-9 text-white opacity-90" />
                  <CardTitle className="text-2xl font-bold">
                    Legg til saldo
                  </CardTitle>
                </div>
                <CardDescription className="text-blue-100 text-center max-w-md">
                  Fyll på kontoen din for å få tilgang til alle funksjoner
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBackToDashboard}
                />
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

          <div className="mt-5 flex justify-center">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til Min Konto
            </Button>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 mb-2">
            <img src="/stripe.png" alt="Stripe" className="h-8" />
            <img src="/visa2.png" alt="Visa" className="h-7" />
            <img src="/mastercard.png" alt="Mastercard" className="h-7" />
          </div>
        </div>
      )}

      {!showPaymentForm && (
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
      )}
    </div>
  );
};

export default PaymentPage;

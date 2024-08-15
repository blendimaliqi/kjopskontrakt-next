"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Balance from "@/components/Balance";
import Deposit from "@/components/Deposit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, DollarSign } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const ProfilePage = () => {
  const { data: session } = useSession();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">
              Vennligst logg inn for å se profilen din.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Din Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              Brukerinformasjon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Mail className="mr-2" />
              <span>{session.user.email}</span>
            </div>
            <Button variant="outline">Rediger Profil</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" />
              Kontobalanse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Balance />
          </CardContent>
        </Card>

        {/* <Deposit /> */}

        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default ProfilePage;

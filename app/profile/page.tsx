"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Balance from "@/components/Balance";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, DollarSign, Home, LogIn } from "lucide-react";
import Link from "next/link";

const LoginMessage: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <LogIn className="mr-2" />
        Innlogging påkrevd
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>Du må være logget inn for å se profilen din.</p>
    </CardContent>
    <CardFooter>
      <Button asChild>
        <Link href="/auth/signin">Gå til innlogging</Link>
      </Button>
    </CardFooter>
  </Card>
);

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">Laster...</div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoginMessage />
      </div>
    );
  }

  return (
    <div className="flex flex-col container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-16">Min Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-start">
              <User className="mr-2" />
              Brukerinformasjon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <Mail className="mr-2" />
              <span>{session && session.user.email}</span>
            </div>
            {/* <Button variant="outline" style={{ marginTop: "38px" }}>
              Rediger Profil
            </Button> */}
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
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Nåværende saldo</div>
              <div className="text-3xl font-bold flex items-baseline">
                <Balance />
              </div>
            </div>
            <Button asChild variant="default" className="w-full">
              <Link href="/payments-form">Legg til beløp</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="outline" className="mt-8">
        <Link href="/">
          <Home className="mr-2" /> Tilbake til kjøpskontrakt
        </Link>
      </Button>
    </div>
  );
};

export default ProfilePage;

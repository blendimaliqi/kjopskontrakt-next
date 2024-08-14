"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Balance from "@/components/Balance";
import Deposit from "@/components/Deposit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, DollarSign } from "lucide-react";

const ProfilePage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Mail className="mr-2" />
              <span>{session.user.email}</span>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Balance />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <Deposit />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogOut,
  CreditCard,
  Settings,
  Coins,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Balance from "@/components/Balance";

const DropdownProfile = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex space-x-3">
        <Button
          asChild
          variant="ghost"
          className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
        >
          <Link href="/auth/signin">Logg inn</Link>
        </Button>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/auth/signup">Registrer</Link>
        </Button>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: window.location.origin });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="mr-1">{session.user.name || "Profil"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="bottom"
        sideOffset={5}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || "Bruker"}
            </p>
            <p className="text-xs leading-none text-gray-500">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/profile" className="flex-grow">
              Min profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/payments-form" className="flex-grow">
              Legg til beløp
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Coins className="mr-2 h-4 w-4" />
            <Link href="/pricing" className="flex-grow">
              Pris
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex flex-col items-start">
          <span className="font-medium">Kontobalanse:</span>
          <div className="w-full">
            <Balance />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logg ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownProfile;

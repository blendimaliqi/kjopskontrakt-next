"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, CreditCard, Settings, Coins } from "lucide-react";
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
      <div className="flex space-x-4">
        <Button asChild variant="outline">
          <Link href="/auth/signin">Logg inn</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">Registrer</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          Profil
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="bottom"
        sideOffset={5}
      >
        <DropdownMenuLabel>
          {" "}
          <span className="text-sm truncate w-full">{session.user.email}</span>
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
          {/* <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings" className="flex-grow">
              Instillinger
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex flex-col items-start">
          <span className="font-medium">Kontobalanse:</span>
          <div className="w-full">
            <Balance />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span className="cursor-pointer">Logg ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownProfile;

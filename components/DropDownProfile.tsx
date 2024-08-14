"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, CreditCard, Settings } from "lucide-react";
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

const DropDownMenuDemo = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex space-x-4">
        <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
          Sign In
        </Link>
        <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 max-w-[calc(100vw-2rem)]"
        align="end"
        alignOffset={-16}
        style={{
          position: "fixed",
          right: "1rem",
          top: "calc(var(--header-height, 4rem) + 0.5rem)",
        }}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/profile">Your Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="font-medium">Email:</span>
          <span className="ml-2 truncate">{session.user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="font-medium">Balance:</span>
          <div className="ml-2">
            <Balance />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuDemo;

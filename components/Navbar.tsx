"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Kjøpskontrakt
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  pathname === "/"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Hjem
              </Link>
              <Link
                href="/contract"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  pathname === "/contract"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Kjøpskontrakt
              </Link>
              <Link
                href="/#hvordan-det-fungerer"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Hvordan det fungerer
              </Link>
              <Link
                href="/#priser"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Priser
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "authenticated" && session?.user?.email ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={handleSignOut}
                >
                  Logg ut
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/auth/signin">Logg inn</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup">Registrer deg</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

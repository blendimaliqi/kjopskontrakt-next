"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Wallet, FileText, Home, HelpCircle, CreditCard } from "lucide-react";
import { getBaseUrl } from "@/utils/auth";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [userInteraction, setUserInteraction] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;

    // Always show navbar when at the top of the page
    if (currentScrollPos < 10) {
      setVisible(true);
      setPrevScrollPos(currentScrollPos);
      return;
    }

    // Regular scroll behavior: Show when scrolling up, hide when scrolling down
    // But only if the user has interacted with the page first (scrolled manually)
    if (userInteraction) {
      setVisible(prevScrollPos > currentScrollPos);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, userInteraction]);

  // Set up the scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Set up an event listener to detect manual user scrolling
  useEffect(() => {
    const handleUserScroll = (e: WheelEvent) => {
      if (!userInteraction) {
        setUserInteraction(true);
      }
    };

    window.addEventListener("wheel", handleUserScroll);
    return () => window.removeEventListener("wheel", handleUserScroll);
  }, [userInteraction]);

  const handleSignOut = async () => {
    // Use the helper function to get the correct base URL
    const baseUrl = getBaseUrl();
    await signOut({ callbackUrl: baseUrl });
  };

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();

      // Always ensure navbar is visible when navigation is clicked
      setVisible(true);

      // Reset user interaction so navbar stays visible until user manually scrolls
      setUserInteraction(false);

      // If we're not on the home page, navigate there first, then scroll
      if (pathname !== "/") {
        router.push(`/${targetId}`);
        return;
      }

      // If we're already on the home page, just scroll to the section
      const targetElement = document.getElementById(targetId.substring(1));
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for the fixed header
          behavior: "smooth",
        });
      }
    },
    [pathname, router]
  );

  return (
    <nav
      className={`bg-white shadow-sm border-b fixed top-0 w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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
                <Home className="mr-1 h-4 w-4" />
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
                <FileText className="mr-1 h-4 w-4" />
                Kjøpskontrakt
              </Link>
              <a
                href="/#hvordan-det-fungerer"
                onClick={(e) => handleSmoothScroll(e, "#hvordan-det-fungerer")}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <HelpCircle className="mr-1 h-4 w-4" />
                Hvordan det fungerer
              </a>
              <a
                href="/#priser"
                onClick={(e) => handleSmoothScroll(e, "#priser")}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <CreditCard className="mr-1 h-4 w-4" />
                Priser
              </a>
              {status === "authenticated" && (
                <Link
                  href="/payments-form"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    pathname === "/payments-form"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Wallet className="mr-1 h-4 w-4" />
                  Min Konto
                </Link>
              )}
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

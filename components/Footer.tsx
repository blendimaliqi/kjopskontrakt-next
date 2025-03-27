import React from "react";
import Link from "next/link";
import {
  Car,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Kjøpskontrakt-bil</span>
            </div>
            <p className="text-gray-400 mb-6 pr-4">
              Vi tilbyr en enkel og sikker måte å generere juridisk gyldige
              kjøpskontrakter for bil på nett. Vår tjeneste er designet for å
              gjøre prosessen så smidig som mulig for både kjøpere og selgere.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Hurtiglenker
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Om oss
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Vilkår og betingelser
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Ofte stilte spørsmål
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Personvernerklæring
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Kontakt oss
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">Kongensgate 1, 0153 Oslo</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <a
                  href="mailto:support@kjopskontrakt.no"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  support@kjopskontrakt.no
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <a
                  href="tel:+4712345678"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  +47 12 34 56 78
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Kjøpskontrakt-bil Generator. Alle
              rettigheter forbeholdt.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Personvern
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Vilkår
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

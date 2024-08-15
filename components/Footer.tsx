import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Om oss</h3>
                <p className="text-sm text-gray-600">
                  Vi tilbyr en enkel og sikker måte å generere kjøpskontrakter
                  for bil på nett. Vår tjeneste er designet for å gjøre
                  prosessen så smidig som mulig for både kjøpere og selgere.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Hurtiglenker</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li>
                    <a
                      href="/terms-and-conditions"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Vilkår og betingelser
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy-policy"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Personvernerklæring
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Ofte stilte spørsmål
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Kontakt oss
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Kjøpskontrakt-bil Generator. Alle
            rettigheter forbeholdt.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

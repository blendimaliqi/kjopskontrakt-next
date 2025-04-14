import React, { useState, ChangeEvent, ClipboardEvent, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generatePDF } from "../utils/pdfGenerator";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface FormData {
  selger_fornavn: string;
  selger_etternavn: string;
  selger_adresse: string;
  selger_postnummer: string;
  selger_poststed: string;
  selger_fodselsdato: string;
  selger_tlf_arbeid: string;
  kjoper_fornavn: string;
  kjoper_etternavn: string;
  kjoper_adresse: string;
  kjoper_postnummer: string;
  kjoper_poststed: string;
  kjoper_fodselsdato: string;
  kjoper_tlf_arbeid: string;
  regnr: string;
  bilmerke: string;
  type: string;
  arsmodell: string;
  km_stand: string;
  siste_eu_kontroll: string;
  kjopesum: string;
  betalingsmate: string;
  selgers_kontonummer: string;
  omregistreringsavgift_betales_av: "kjoper" | "selger";
  omregistreringsavgift_belop: string;
  utstyr_sommer: boolean;
  utstyr_vinter: boolean;
  utstyr_annet: boolean;
  utstyr_spesifisert: string;
  andre_kommentarer: string;
  sted_kjoper: string;
  dato_kjoper: string;
  selgers_underskrift: string;
  kjopers_underskrift: string;
  include_disclaimer: boolean;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_logo: File | null;
  company_logo_base64: string;
  include_company_info: boolean;
  custom_header_text: string;
  primary_color: string;
}

const PurchaseContractForm: React.FC = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session && session.user && session.user.email);

  const validationSchema = Yup.object({
    selger_fornavn: Yup.string().required("Påkrevd"),
    selger_etternavn: Yup.string().required("Påkrevd"),
    selger_adresse: Yup.string().required("Påkrevd"),
    selger_postnummer: Yup.string().required("Påkrevd"),
    selger_poststed: Yup.string().required("Påkrevd"),
    selger_fodselsdato: Yup.string().required("Påkrevd"),
    selger_tlf_arbeid: Yup.string().required("Påkrevd"),
    kjoper_fornavn: Yup.string().required("Påkrevd"),
    kjoper_etternavn: Yup.string().required("Påkrevd"),
    kjoper_adresse: Yup.string().required("Påkrevd"),
    kjoper_postnummer: Yup.string().required("Påkrevd"),
    kjoper_poststed: Yup.string().required("Påkrevd"),
    kjoper_fodselsdato: Yup.string().required("Påkrevd"),
    kjoper_tlf_arbeid: Yup.string().required("Påkrevd"),
    regnr: Yup.string().required("Påkrevd"),
    kjopesum: Yup.number().typeError("Må være et tall").required("Påkrevd"),
    omregistreringsavgift_betales_av: Yup.string()
      .oneOf(["kjoper", "selger"])
      .required("Påkrevd"),
  });

  const formik = useFormik<FormData>({
    initialValues: {
      selger_fornavn: "",
      selger_etternavn: "",
      selger_adresse: "",
      selger_postnummer: "",
      selger_poststed: "",
      selger_fodselsdato: "",
      selger_tlf_arbeid: "",
      kjoper_fornavn: "",
      kjoper_etternavn: "",
      kjoper_adresse: "",
      kjoper_postnummer: "",
      kjoper_poststed: "",
      kjoper_fodselsdato: "",
      kjoper_tlf_arbeid: "",
      regnr: "",
      bilmerke: "",
      type: "",
      arsmodell: "",
      km_stand: "",
      siste_eu_kontroll: "",
      kjopesum: "",
      betalingsmate: "",
      selgers_kontonummer: "",
      omregistreringsavgift_betales_av: "kjoper",
      omregistreringsavgift_belop: "",
      utstyr_sommer: false,
      utstyr_vinter: false,
      utstyr_annet: false,
      utstyr_spesifisert: "",
      andre_kommentarer: "",
      sted_kjoper: "",
      dato_kjoper: "",
      selgers_underskrift: "",
      kjopers_underskrift: "",
      include_disclaimer: true,
      company_name: "",
      company_address: "",
      company_email: "",
      company_phone: "",
      company_logo: null,
      company_logo_base64: "",
      include_company_info: false,
      custom_header_text: "",
      primary_color: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleGeneratePDF(values);
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const handleSelectChange = (name: string) => (value: string) => {
    formik.setFieldValue(name, value);
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    formik.setFieldValue(name, checked);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const sanitizedText = pastedText
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const target = e.target as HTMLTextAreaElement;
    const { name } = target;
    formik.setFieldValue(name, sanitizedText);
  };

  const fetchBalance = async (retryCount = 0) => {
    try {
      const response = await fetch("/api/account/balance", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retryCount < 2) {
          console.log(`Auth error, retrying... (${retryCount + 1})`);
          setTimeout(() => fetchBalance(retryCount + 1), 1000);
          return;
        }
        throw new Error(data.error || "An unknown error occurred");
      }

      setBalance(data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
      setError(`Failed to fetch balance: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/account/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: 9.9 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred");
      }

      generatePDF(formik.values);
      fetchBalance();
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(`Withdrawal failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = (values: FormData) => {
    handleWithdraw();
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBalance();
    }
  }, [isLoggedIn]);

  const getButtonText = () => {
    if (!isLoggedIn) return "Logg inn for å generere PDF";
    if (isLoading) return "Genererer...";
    if (balance !== null && Number(balance) < 9.9)
      return "Legg til penger (Kun kr 9.90.- per generering)";
    return "Generer PDF (kr 9.90.-)";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl border-t border-blue-500 rounded-xl overflow-hidden">
      <CardHeader className="border-b bg-white p-6 flex flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-600">
            {formik.values.custom_header_text || "Kjøpskontrakt"}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Fyll ut alle nødvendige detaljer for å generere en juridisk bindende
            kontrakt
          </p>
        </div>
        {formik.values.include_company_info &&
          formik.values.company_logo_base64 && (
            <div className="h-16">
              <img
                src={formik.values.company_logo_base64}
                alt="Company Logo"
                className="h-full max-h-16 object-contain"
              />
            </div>
          )}
      </CardHeader>
      <CardContent className="p-8 bg-gray-50/50">
        <form
          id="customForm"
          className="space-y-8"
          onSubmit={formik.handleSubmit}
        >
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
              <h3 className="text-lg font-semibold text-blue-700">
                Tilpass kontrakten
              </h3>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="include_company_info"
                  checked={formik.values.include_company_info}
                  onCheckedChange={handleCheckboxChange("include_company_info")}
                />
                <Label htmlFor="include_company_info" className="font-medium">
                  Inkluder firmalogo og informasjon
                </Label>
              </div>

              {formik.values.include_company_info && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="font-medium">
                        Firmanavn
                      </Label>
                      <Input
                        id="company_name"
                        {...formik.getFieldProps("company_name")}
                        placeholder="Ditt firmanavn"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_address" className="font-medium">
                        Firmaadresse
                      </Label>
                      <Input
                        id="company_address"
                        {...formik.getFieldProps("company_address")}
                        placeholder="Gate, postnummer og sted"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_email" className="font-medium">
                        Firma e-post
                      </Label>
                      <Input
                        id="company_email"
                        {...formik.getFieldProps("company_email")}
                        placeholder="Din e-postadresse"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_phone" className="font-medium">
                        Firma telefon
                      </Label>
                      <Input
                        id="company_phone"
                        {...formik.getFieldProps("company_phone")}
                        placeholder="Ditt telefonnummer"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="custom_header_text"
                        className="font-medium"
                      >
                        Overskrift
                      </Label>
                      <Input
                        id="custom_header_text"
                        {...formik.getFieldProps("custom_header_text")}
                        placeholder="F.eks: Kjøpskontrakt for bil"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary_color" className="font-medium">
                        Primærfarge (HEX)
                      </Label>
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <Input
                          id="primary_color"
                          {...formik.getFieldProps("primary_color")}
                          placeholder="#0062cc"
                          defaultValue="#0062cc"
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div
                          className="w-8 h-8 rounded-md border shadow-inner"
                          style={{
                            backgroundColor:
                              formik.values.primary_color || "#0062cc",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="company_logo" className="font-medium">
                      Firmalogo
                    </Label>
                    <div className="bg-white p-4 rounded-md border border-blue-100">
                      <Input
                        id="company_logo"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          formik.setFieldValue("company_logo", file);

                          // Convert the image file to base64
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64String = reader.result as string;
                              formik.setFieldValue(
                                "company_logo_base64",
                                base64String
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Logo vil bli plassert på toppen av PDF-dokumentet.
                        Anbefalt størrelse: 200x100px.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Selger
                </h3>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selger_fornavn" className="font-medium">
                      Fornavn
                    </Label>
                    <Input
                      id="selger_fornavn"
                      {...formik.getFieldProps("selger_fornavn")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.selger_fornavn &&
                    formik.errors.selger_fornavn ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.selger_fornavn}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_etternavn" className="font-medium">
                      Etternavn
                    </Label>
                    <Input
                      id="selger_etternavn"
                      {...formik.getFieldProps("selger_etternavn")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.selger_etternavn &&
                    formik.errors.selger_etternavn ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.selger_etternavn}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selger_adresse" className="font-medium">
                    Adresse
                  </Label>
                  <Input
                    id="selger_adresse"
                    {...formik.getFieldProps("selger_adresse")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.selger_adresse &&
                  formik.errors.selger_adresse ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.selger_adresse}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selger_postnummer" className="font-medium">
                      Postnummer
                    </Label>
                    <Input
                      id="selger_postnummer"
                      {...formik.getFieldProps("selger_postnummer")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.selger_postnummer &&
                    formik.errors.selger_postnummer ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.selger_postnummer}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_poststed" className="font-medium">
                      Poststed
                    </Label>
                    <Input
                      id="selger_poststed"
                      {...formik.getFieldProps("selger_poststed")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.selger_poststed &&
                    formik.errors.selger_poststed ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.selger_poststed}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selger_fodselsdato" className="font-medium">
                    Person/org.nr
                  </Label>
                  <Input
                    id="selger_fodselsdato"
                    {...formik.getFieldProps("selger_fodselsdato")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.selger_fodselsdato &&
                  formik.errors.selger_fodselsdato ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.selger_fodselsdato}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selger_tlf_arbeid" className="font-medium">
                    Telefon
                  </Label>
                  <Input
                    id="selger_tlf_arbeid"
                    {...formik.getFieldProps("selger_tlf_arbeid")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.selger_tlf_arbeid &&
                  formik.errors.selger_tlf_arbeid ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.selger_tlf_arbeid}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Kjøper
                </h3>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_fornavn" className="font-medium">
                      Fornavn
                    </Label>
                    <Input
                      id="kjoper_fornavn"
                      {...formik.getFieldProps("kjoper_fornavn")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.kjoper_fornavn &&
                    formik.errors.kjoper_fornavn ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.kjoper_fornavn}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_etternavn" className="font-medium">
                      Etternavn
                    </Label>
                    <Input
                      id="kjoper_etternavn"
                      {...formik.getFieldProps("kjoper_etternavn")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.kjoper_etternavn &&
                    formik.errors.kjoper_etternavn ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.kjoper_etternavn}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kjoper_adresse" className="font-medium">
                    Adresse
                  </Label>
                  <Input
                    id="kjoper_adresse"
                    {...formik.getFieldProps("kjoper_adresse")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.kjoper_adresse &&
                  formik.errors.kjoper_adresse ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.kjoper_adresse}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_postnummer" className="font-medium">
                      Postnummer
                    </Label>
                    <Input
                      id="kjoper_postnummer"
                      {...formik.getFieldProps("kjoper_postnummer")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.kjoper_postnummer &&
                    formik.errors.kjoper_postnummer ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.kjoper_postnummer}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_poststed" className="font-medium">
                      Poststed
                    </Label>
                    <Input
                      id="kjoper_poststed"
                      {...formik.getFieldProps("kjoper_poststed")}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.kjoper_poststed &&
                    formik.errors.kjoper_poststed ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.kjoper_poststed}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kjoper_fodselsdato" className="font-medium">
                    Person/org.nr
                  </Label>
                  <Input
                    id="kjoper_fodselsdato"
                    {...formik.getFieldProps("kjoper_fodselsdato")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.kjoper_fodselsdato &&
                  formik.errors.kjoper_fodselsdato ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.kjoper_fodselsdato}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kjoper_tlf_arbeid" className="font-medium">
                    Telefon
                  </Label>
                  <Input
                    id="kjoper_tlf_arbeid"
                    {...formik.getFieldProps("kjoper_tlf_arbeid")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.kjoper_tlf_arbeid &&
                  formik.errors.kjoper_tlf_arbeid ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.kjoper_tlf_arbeid}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h5.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V8a1 1 0 00-.293-.707l-2-2A1 1 0 0018 5h-3.05a2.5 2.5 0 01-4.9 0H3z" />
                </svg>
                Kjøretøy
              </h3>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="omregistreringsavgift_betales_av"
                    className="font-medium"
                  >
                    Omregistreringsavgift betales av
                  </Label>
                  <Select
                    value={formik.values.omregistreringsavgift_betales_av}
                    onValueChange={handleSelectChange(
                      "omregistreringsavgift_betales_av"
                    )}
                  >
                    <SelectTrigger
                      id="omregistreringsavgift_betales_av"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kjoper">Kjøper</SelectItem>
                      <SelectItem value="selger">Selger</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.omregistreringsavgift_betales_av &&
                  formik.errors.omregistreringsavgift_betales_av ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.omregistreringsavgift_betales_av}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="omregistreringsavgift_belop"
                    className="font-medium"
                  >
                    Beløp
                  </Label>
                  <Input
                    id="omregistreringsavgift_belop"
                    {...formik.getFieldProps("omregistreringsavgift_belop")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.omregistreringsavgift_belop &&
                  formik.errors.omregistreringsavgift_belop ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.omregistreringsavgift_belop}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regnr" className="font-medium">
                    Reg.nr
                  </Label>
                  <Input
                    id="regnr"
                    {...formik.getFieldProps("regnr")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.regnr && formik.errors.regnr ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.regnr}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilmerke" className="font-medium">
                    Bilmerke
                  </Label>
                  <Input
                    id="bilmerke"
                    {...formik.getFieldProps("bilmerke")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.bilmerke && formik.errors.bilmerke ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.bilmerke}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="font-medium">
                    Type
                  </Label>
                  <Input
                    id="type"
                    {...formik.getFieldProps("type")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.type && formik.errors.type ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.type}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arsmodell" className="font-medium">
                    Årsmodell
                  </Label>
                  <Input
                    id="arsmodell"
                    {...formik.getFieldProps("arsmodell")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.arsmodell && formik.errors.arsmodell ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.arsmodell}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km_stand" className="font-medium">
                    Km stand
                  </Label>
                  <Input
                    id="km_stand"
                    {...formik.getFieldProps("km_stand")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.km_stand && formik.errors.km_stand ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.km_stand}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siste_eu_kontroll" className="font-medium">
                    Siste EU-kontroll
                  </Label>
                  <Input
                    id="siste_eu_kontroll"
                    type="date"
                    {...formik.getFieldProps("siste_eu_kontroll")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.siste_eu_kontroll &&
                  formik.errors.siste_eu_kontroll ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.siste_eu_kontroll}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjopesum" className="font-medium">
                    Kjøpesum
                  </Label>
                  <Input
                    id="kjopesum"
                    {...formik.getFieldProps("kjopesum")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.kjopesum && formik.errors.kjopesum ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.kjopesum}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="betalingsmate" className="font-medium">
                    Betalingsmåte
                  </Label>
                  <Input
                    id="betalingsmate"
                    {...formik.getFieldProps("betalingsmate")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.betalingsmate &&
                  formik.errors.betalingsmate ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.betalingsmate}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selgers_kontonummer" className="font-medium">
                    Selgers kontonummer
                  </Label>
                  <Input
                    id="selgers_kontonummer"
                    {...formik.getFieldProps("selgers_kontonummer")}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.selgers_kontonummer &&
                  formik.errors.selgers_kontonummer ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.selgers_kontonummer}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Utstyr inkludert i kjøpesum
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_sommer"
                    checked={formik.values.utstyr_sommer}
                    onCheckedChange={handleCheckboxChange("utstyr_sommer")}
                    className="text-blue-600"
                  />
                  <Label htmlFor="utstyr_sommer" className="font-medium">
                    Sommerhjul
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_vinter"
                    checked={formik.values.utstyr_vinter}
                    onCheckedChange={handleCheckboxChange("utstyr_vinter")}
                    className="text-blue-600"
                  />
                  <Label htmlFor="utstyr_vinter" className="font-medium">
                    Vinterhjul
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_annet"
                    checked={formik.values.utstyr_annet}
                    onCheckedChange={handleCheckboxChange("utstyr_annet")}
                    className="text-blue-600"
                  />
                  <Label htmlFor="utstyr_annet" className="font-medium">
                    Annet
                  </Label>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="utstyr_spesifisert" className="font-medium">
                  Hvis ja, vennligst spesifiser
                </Label>
                <Textarea
                  id="utstyr_spesifisert"
                  {...formik.getFieldProps("utstyr_spesifisert")}
                  onPaste={handlePaste}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Andre kommentarer / vilkår
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                id="andre_kommentarer"
                {...formik.getFieldProps("andre_kommentarer")}
                onPaste={handlePaste}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                placeholder="Skriv inn eventuelle andre betingelser, merknader eller kommentarer til kjøpet"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
              <Label htmlFor="sted_kjoper" className="font-medium">
                Sted
              </Label>
              <Input
                id="sted_kjoper"
                {...formik.getFieldProps("sted_kjoper")}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.sted_kjoper && formik.errors.sted_kjoper ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.sted_kjoper}
                </div>
              ) : null}
            </div>
            <div className="space-y-2 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
              <Label htmlFor="dato_kjoper" className="font-medium">
                Dato
              </Label>
              <Input
                id="dato_kjoper"
                type="date"
                {...formik.getFieldProps("dato_kjoper")}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.dato_kjoper && formik.errors.dato_kjoper ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.dato_kjoper}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
              <Label htmlFor="selgers_underskrift" className="font-medium">
                Selgers underskrift
              </Label>
              <Input
                id="selgers_underskrift"
                {...formik.getFieldProps("selgers_underskrift")}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.selgers_underskrift &&
              formik.errors.selgers_underskrift ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.selgers_underskrift}
                </div>
              ) : null}
            </div>
            <div className="space-y-2 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
              <Label htmlFor="kjopers_underskrift" className="font-medium">
                Kjøpers underskrift
              </Label>
              <Input
                id="kjopers_underskrift"
                // {...formik.getFieldProps("kjopers_underskrift")}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.kjopers_underskrift &&
              formik.errors.kjopers_underskrift ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.kjopers_underskrift}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Checkbox
              id="include_disclaimer"
              checked={formik.values.include_disclaimer}
              onCheckedChange={handleCheckboxChange("include_disclaimer")}
              className="text-blue-600"
            />
            <Label htmlFor="include_disclaimer" className="font-medium">
              Inkluder ansvarsfraskrivelse i kontrakten
            </Label>
          </div>

          {!isLoggedIn && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-amber-700 font-medium">
                  Du må være innlogget for å generere PDF.{" "}
                  <Link
                    href="/auth/signin"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Logg inn
                  </Link>{" "}
                  eller{" "}
                  <Link
                    href="/auth/signup"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    registrer deg
                  </Link>{" "}
                  for å fortsette.
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full text-lg py-6 ${
              isLoggedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            } transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
            disabled={
              isLoading ||
              !isLoggedIn ||
              (isLoggedIn && balance !== null && balance < 9.9)
            }
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            )}
            {getButtonText()}
          </Button>

          {!formik.isValid && (
            <div className="text-red-500 mt-4 text-center font-medium p-3 bg-red-50 border border-red-100 rounded-md">
              {"Fyll ut alle påkrevde felter for å generere kontrakten"}
            </div>
          )}

          {error && (
            <div className="text-red-500 mt-4 text-center font-medium p-3 bg-red-50 border border-red-100 rounded-md flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 mt-4 text-center font-medium p-3 bg-green-50 border border-green-100 rounded-md flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseContractForm;

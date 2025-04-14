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
import { useContractFormStore } from "@/store/contractFormStore";

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
  sted_selger: string;
  dato_selger: string;
  sted_kjoper: string;
  dato_kjoper: string;
  selgers_underskrift: string;
  kjopers_underskrift: string;
  include_disclaimer: boolean;
  har_bilen_heftelser: "ja" | "nei" | "velg" | "";
  er_bilen_provekjort: "ja" | "nei" | "velg" | "";
}

const MobilePurchaseContractForm: React.FC = () => {
  const { data: session } = useSession();
  const { formData: storedFormData, setFormData: setStoredFormData } =
    useContractFormStore();

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
    sted_selger: Yup.string(),
    dato_selger: Yup.string(),
    sted_kjoper: Yup.string(),
    dato_kjoper: Yup.string(),
  });

  const formik = useFormik<FormData>({
    initialValues: {
      selger_fornavn: storedFormData.selger_fornavn || "",
      selger_etternavn: storedFormData.selger_etternavn || "",
      selger_adresse: storedFormData.selger_adresse || "",
      selger_postnummer: storedFormData.selger_postnummer || "",
      selger_poststed: storedFormData.selger_poststed || "",
      selger_fodselsdato: storedFormData.selger_fodselsdato || "",
      selger_tlf_arbeid: storedFormData.selger_tlf_arbeid || "",
      kjoper_fornavn: storedFormData.kjoper_fornavn || "",
      kjoper_etternavn: storedFormData.kjoper_etternavn || "",
      kjoper_adresse: storedFormData.kjoper_adresse || "",
      kjoper_postnummer: storedFormData.kjoper_postnummer || "",
      kjoper_poststed: storedFormData.kjoper_poststed || "",
      kjoper_fodselsdato: storedFormData.kjoper_fodselsdato || "",
      kjoper_tlf_arbeid: storedFormData.kjoper_tlf_arbeid || "",
      regnr: storedFormData.regnr || "",
      bilmerke: storedFormData.bilmerke || "",
      type: storedFormData.type || "",
      arsmodell: storedFormData.arsmodell || "",
      km_stand: storedFormData.km_stand || "",
      siste_eu_kontroll: storedFormData.siste_eu_kontroll || "",
      kjopesum: storedFormData.kjopesum || "",
      betalingsmate: storedFormData.betalingsmate || "",
      selgers_kontonummer: storedFormData.selgers_kontonummer || "",
      omregistreringsavgift_betales_av:
        storedFormData.omregistreringsavgift_betales_av || "kjoper",
      omregistreringsavgift_belop:
        storedFormData.omregistreringsavgift_belop || "",
      utstyr_sommer: storedFormData.utstyr_sommer || false,
      utstyr_vinter: storedFormData.utstyr_vinter || false,
      utstyr_annet: storedFormData.utstyr_annet || false,
      utstyr_spesifisert: storedFormData.utstyr_spesifisert || "",
      andre_kommentarer: storedFormData.andre_kommentarer || "",
      sted_selger: storedFormData.sted_selger || "",
      dato_selger: storedFormData.dato_selger || "",
      sted_kjoper: storedFormData.sted_kjoper || "",
      dato_kjoper: storedFormData.dato_kjoper || "",
      selgers_underskrift: storedFormData.selgers_underskrift || "",
      kjopers_underskrift: storedFormData.kjopers_underskrift || "",
      include_disclaimer:
        storedFormData.include_disclaimer !== undefined
          ? storedFormData.include_disclaimer
          : true,
      har_bilen_heftelser: storedFormData.har_bilen_heftelser || "velg",
      er_bilen_provekjort: storedFormData.er_bilen_provekjort || "velg",
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

  const debugValidationErrors = () => {
    console.log("Form validation errors:", formik.errors);
    console.log("Form values:", formik.values);
    return Object.keys(formik.errors).length > 0;
  };

  useEffect(() => {
    if (session && session.user && session.user.email) {
      fetchBalance();
    }
  }, []);

  useEffect(() => {
    setStoredFormData(formik.values);
  }, [formik.values, setStoredFormData]);

  const getButtonText = () => {
    if (!formik.isValid) return "Sjekk at alle obligatoriske felt er fylt ut";
    if (isLoading) return "Genererer...";
    if (balance !== null && Number(balance) < 9.9)
      return "Legg til penger (kr 9.90.-)";
    return "Generer PDF (kr 9.90.-)";
  };
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">Kjøpskontrakt</h2>
      </CardHeader>
      <CardContent>
        <form
          id="customForm"
          className="space-y-6"
          onSubmit={formik.handleSubmit}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Selger</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="selger_fornavn">Fornavn</Label>
                <Input
                  id="selger_fornavn"
                  {...formik.getFieldProps("selger_fornavn")}
                />
                {formik.touched.selger_fornavn &&
                  formik.errors.selger_fornavn && (
                    <div className="text-red-500">
                      {formik.errors.selger_fornavn}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_etternavn">Etternavn</Label>
                <Input
                  id="selger_etternavn"
                  {...formik.getFieldProps("selger_etternavn")}
                />
                {formik.touched.selger_etternavn &&
                  formik.errors.selger_etternavn && (
                    <div className="text-red-500">
                      {formik.errors.selger_etternavn}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_adresse">Adresse</Label>
                <Input
                  id="selger_adresse"
                  {...formik.getFieldProps("selger_adresse")}
                />
                {formik.touched.selger_adresse &&
                  formik.errors.selger_adresse && (
                    <div className="text-red-500">
                      {formik.errors.selger_adresse}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_postnummer">Postnummer</Label>
                <Input
                  id="selger_postnummer"
                  {...formik.getFieldProps("selger_postnummer")}
                />
                {formik.touched.selger_postnummer &&
                  formik.errors.selger_postnummer && (
                    <div className="text-red-500">
                      {formik.errors.selger_postnummer}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_poststed">Poststed</Label>
                <Input
                  id="selger_poststed"
                  {...formik.getFieldProps("selger_poststed")}
                />
                {formik.touched.selger_poststed &&
                  formik.errors.selger_poststed && (
                    <div className="text-red-500">
                      {formik.errors.selger_poststed}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_fodselsdato">Person/org.nr</Label>
                <Input
                  id="selger_fodselsdato"
                  {...formik.getFieldProps("selger_fodselsdato")}
                />
                {formik.touched.selger_fodselsdato &&
                  formik.errors.selger_fodselsdato && (
                    <div className="text-red-500">
                      {formik.errors.selger_fodselsdato}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selger_tlf_arbeid">Telefon</Label>
                <Input
                  id="selger_tlf_arbeid"
                  {...formik.getFieldProps("selger_tlf_arbeid")}
                />
                {formik.touched.selger_tlf_arbeid &&
                  formik.errors.selger_tlf_arbeid && (
                    <div className="text-red-500">
                      {formik.errors.selger_tlf_arbeid}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Kjøper</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kjoper_fornavn">Fornavn</Label>
                <Input
                  id="kjoper_fornavn"
                  {...formik.getFieldProps("kjoper_fornavn")}
                />
                {formik.touched.kjoper_fornavn &&
                  formik.errors.kjoper_fornavn && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_fornavn}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_etternavn">Etternavn</Label>
                <Input
                  id="kjoper_etternavn"
                  {...formik.getFieldProps("kjoper_etternavn")}
                />
                {formik.touched.kjoper_etternavn &&
                  formik.errors.kjoper_etternavn && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_etternavn}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_adresse">Adresse</Label>
                <Input
                  id="kjoper_adresse"
                  {...formik.getFieldProps("kjoper_adresse")}
                />
                {formik.touched.kjoper_adresse &&
                  formik.errors.kjoper_adresse && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_adresse}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_postnummer">Postnummer</Label>
                <Input
                  id="kjoper_postnummer"
                  {...formik.getFieldProps("kjoper_postnummer")}
                />
                {formik.touched.kjoper_postnummer &&
                  formik.errors.kjoper_postnummer && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_postnummer}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_poststed">Poststed</Label>
                <Input
                  id="kjoper_poststed"
                  {...formik.getFieldProps("kjoper_poststed")}
                />
                {formik.touched.kjoper_poststed &&
                  formik.errors.kjoper_poststed && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_poststed}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_fodselsdato">Person/org.nr</Label>
                <Input
                  id="kjoper_fodselsdato"
                  {...formik.getFieldProps("kjoper_fodselsdato")}
                />
                {formik.touched.kjoper_fodselsdato &&
                  formik.errors.kjoper_fodselsdato && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_fodselsdato}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjoper_tlf_arbeid">Telefon</Label>
                <Input
                  id="kjoper_tlf_arbeid"
                  {...formik.getFieldProps("kjoper_tlf_arbeid")}
                />
                {formik.touched.kjoper_tlf_arbeid &&
                  formik.errors.kjoper_tlf_arbeid && (
                    <div className="text-red-500">
                      {formik.errors.kjoper_tlf_arbeid}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Kjøretøy</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="omregistreringsavgift_betales_av">
                  Omregistreringsavgift betales av
                </Label>
                <Select
                  value={formik.values.omregistreringsavgift_betales_av}
                  onValueChange={handleSelectChange(
                    "omregistreringsavgift_betales_av"
                  )}
                >
                  <SelectTrigger id="omregistreringsavgift_betales_av">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kjoper">Kjøper</SelectItem>
                    <SelectItem value="selger">Selger</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.omregistreringsavgift_betales_av &&
                  formik.errors.omregistreringsavgift_betales_av && (
                    <div className="text-red-500">
                      {formik.errors.omregistreringsavgift_betales_av}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="omregistreringsavgift_belop">Beløp</Label>
                <Input
                  id="omregistreringsavgift_belop"
                  {...formik.getFieldProps("omregistreringsavgift_belop")}
                />
                {formik.touched.omregistreringsavgift_belop &&
                  formik.errors.omregistreringsavgift_belop && (
                    <div className="text-red-500">
                      {formik.errors.omregistreringsavgift_belop}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="regnr">Reg.nr</Label>
                <Input id="regnr" {...formik.getFieldProps("regnr")} />
                {formik.touched.regnr && formik.errors.regnr && (
                  <div className="text-red-500">{formik.errors.regnr}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bilmerke">Bilmerke</Label>
                <Input id="bilmerke" {...formik.getFieldProps("bilmerke")} />
                {formik.touched.bilmerke && formik.errors.bilmerke && (
                  <div className="text-red-500">{formik.errors.bilmerke}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" {...formik.getFieldProps("type")} />
                {formik.touched.type && formik.errors.type && (
                  <div className="text-red-500">{formik.errors.type}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="arsmodell">Årsmodell</Label>
                <Input id="arsmodell" {...formik.getFieldProps("arsmodell")} />
                {formik.touched.arsmodell && formik.errors.arsmodell && (
                  <div className="text-red-500">{formik.errors.arsmodell}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="km_stand">Km stand</Label>
                <Input id="km_stand" {...formik.getFieldProps("km_stand")} />
                {formik.touched.km_stand && formik.errors.km_stand && (
                  <div className="text-red-500">{formik.errors.km_stand}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="siste_eu_kontroll">Siste EU-kontroll</Label>
                <Input
                  id="siste_eu_kontroll"
                  type="date"
                  {...formik.getFieldProps("siste_eu_kontroll")}
                />
                {formik.touched.siste_eu_kontroll &&
                  formik.errors.siste_eu_kontroll && (
                    <div className="text-red-500">
                      {formik.errors.siste_eu_kontroll}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kjopesum">Kjøpesum</Label>
                <Input id="kjopesum" {...formik.getFieldProps("kjopesum")} />
                {formik.touched.kjopesum && formik.errors.kjopesum && (
                  <div className="text-red-500">{formik.errors.kjopesum}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="betalingsmate">Betalingsmåte</Label>
                <Input
                  id="betalingsmate"
                  {...formik.getFieldProps("betalingsmate")}
                />
                {formik.touched.betalingsmate &&
                  formik.errors.betalingsmate && (
                    <div className="text-red-500">
                      {formik.errors.betalingsmate}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selgers_kontonummer">Selgers kontonummer</Label>
                <Input
                  id="selgers_kontonummer"
                  {...formik.getFieldProps("selgers_kontonummer")}
                />
                {formik.touched.selgers_kontonummer &&
                  formik.errors.selgers_kontonummer && (
                    <div className="text-red-500">
                      {formik.errors.selgers_kontonummer}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Utstyr inkludert i kjøpesum
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utstyr_sommer"
                    checked={formik.values.utstyr_sommer}
                    onCheckedChange={handleCheckboxChange("utstyr_sommer")}
                  />
                  <Label htmlFor="utstyr_sommer">Sommerhjul</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utstyr_vinter"
                    checked={formik.values.utstyr_vinter}
                    onCheckedChange={handleCheckboxChange("utstyr_vinter")}
                  />
                  <Label htmlFor="utstyr_vinter">Vinterhjul</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utstyr_annet"
                    checked={formik.values.utstyr_annet}
                    onCheckedChange={handleCheckboxChange("utstyr_annet")}
                  />
                  <Label htmlFor="utstyr_annet">Annet</Label>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="utstyr_spesifisert">
                  Hvis ja, vennligst spesifiser
                </Label>
                <Textarea
                  id="utstyr_spesifisert"
                  {...formik.getFieldProps("utstyr_spesifisert")}
                  onPaste={handlePaste}
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="har_bilen_heftelser">
                    Har bilen heftelser
                  </Label>
                  <Select
                    value={formik.values.har_bilen_heftelser}
                    onValueChange={handleSelectChange("har_bilen_heftelser")}
                  >
                    <SelectTrigger id="har_bilen_heftelser">
                      <SelectValue placeholder="Velg" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="velg">Velg</SelectItem>
                      <SelectItem value="ja">Ja</SelectItem>
                      <SelectItem value="nei">Nei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="er_bilen_provekjort">
                    Er bilen prøvekjørt og besiktet
                  </Label>
                  <Select
                    value={formik.values.er_bilen_provekjort}
                    onValueChange={handleSelectChange("er_bilen_provekjort")}
                  >
                    <SelectTrigger id="er_bilen_provekjort">
                      <SelectValue placeholder="Velg" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="velg">Velg</SelectItem>
                      <SelectItem value="ja">Ja</SelectItem>
                      <SelectItem value="nei">Nei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Andre kommentarer / vilkår
              </h3>
            </CardHeader>
            <CardContent>
              <Textarea
                id="andre_kommentarer"
                {...formik.getFieldProps("andre_kommentarer")}
                onPaste={handlePaste}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Signatur og dato</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4 pb-2 border-b">
                <h4 className="mb-2 font-medium">Selger</h4>
                <div className="space-y-2">
                  <Label htmlFor="sted_selger">Sted (selger)</Label>
                  <Input
                    id="sted_selger"
                    {...formik.getFieldProps("sted_selger")}
                  />
                  {formik.touched.sted_selger && formik.errors.sted_selger && (
                    <div className="text-red-500">
                      {formik.errors.sted_selger}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="dato_selger">Dato (selger)</Label>
                  <Input
                    id="dato_selger"
                    type="date"
                    {...formik.getFieldProps("dato_selger")}
                  />
                  {formik.touched.dato_selger && formik.errors.dato_selger && (
                    <div className="text-red-500">
                      {formik.errors.dato_selger}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="selgers_underskrift">
                    Selgers underskrift
                  </Label>
                  <Input
                    id="selgers_underskrift"
                    {...formik.getFieldProps("selgers_underskrift")}
                  />
                  {formik.touched.selgers_underskrift &&
                    formik.errors.selgers_underskrift && (
                      <div className="text-red-500">
                        {formik.errors.selgers_underskrift}
                      </div>
                    )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Kjøper</h4>
                <div className="space-y-2">
                  <Label htmlFor="sted_kjoper">Sted (kjøper)</Label>
                  <Input
                    id="sted_kjoper"
                    {...formik.getFieldProps("sted_kjoper")}
                  />
                  {formik.touched.sted_kjoper && formik.errors.sted_kjoper && (
                    <div className="text-red-500">
                      {formik.errors.sted_kjoper}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="dato_kjoper">Dato (kjøper)</Label>
                  <Input
                    id="dato_kjoper"
                    type="date"
                    {...formik.getFieldProps("dato_kjoper")}
                  />
                  {formik.touched.dato_kjoper && formik.errors.dato_kjoper && (
                    <div className="text-red-500">
                      {formik.errors.dato_kjoper}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="kjopers_underskrift">
                    Kjøpers underskrift
                  </Label>
                  <Input
                    id="kjopers_underskrift"
                    {...formik.getFieldProps("kjopers_underskrift")}
                  />
                  {formik.touched.kjopers_underskrift &&
                    formik.errors.kjopers_underskrift && (
                      <div className="text-red-500">
                        {formik.errors.kjopers_underskrift}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include_disclaimer"
              checked={formik.values.include_disclaimer}
              onCheckedChange={handleCheckboxChange("include_disclaimer")}
            />
            <Label htmlFor="include_disclaimer">
              Inkluder ansvarsfraskrivelse i kontrakten
            </Label>
          </div>

          {balance !== null && balance < 9.9 ? (
            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => (window.location.href = "/payments-form")}
            >
              Legg til penger (Kun kr 9.90.- per generering)
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              onClick={() => debugValidationErrors()}
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          )}

          {!formik.isValid && (
            <div className="text-red-500 mt-2">
              {"Fyll ut alle påkrevde felter"}
            </div>
          )}

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">{success}</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default MobilePurchaseContractForm;

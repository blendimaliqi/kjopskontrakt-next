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
}

const PurchaseContractForm: React.FC = () => {
  const { data: session } = useSession();

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
    // bilmerke: Yup.string().required("Påkrevd"),
    // type: Yup.string().required("Påkrevd"),
    // arsmodell: Yup.string().required("Påkrevd"),
    // km_stand: Yup.string().required("Påkrevd"),
    // siste_eu_kontroll: Yup.date().required("Påkrevd"),
    kjopesum: Yup.number().required("Påkrevd"),
    // betalingsmate: Yup.string().required("Påkrevd"),
    // selgers_kontonummer: Yup.string().required("Påkrevd"),
    omregistreringsavgift_betales_av: Yup.string()
      .oneOf(["kjoper", "selger"])
      .required("Påkrevd"),
    // omregistreringsavgift_belop: Yup.number().required("Påkrevd"),
    // sted_kjoper: Yup.string().required("Påkrevd"),
    // dato_kjoper: Yup.date().required("Påkrevd"),
    // selgers_underskrift: Yup.string().required("Påkrevd"),
    // kjopers_underskrift: Yup.string().required("Påkrevd"),
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

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/account/balance", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
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
    if (session && session.user && session.user.email) {
      fetchBalance();
    }
  }, []);

  const getButtonText = () => {
    if (isLoading) return "Genererer...";
    if (balance !== null && Number(balance) < 9.9)
      return "Legg til penger (Kun kr 9.90.- per generering)";
    return "Generer PDF (kr 9.90.-)";
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Kjøpskontrakt</h2>
      </CardHeader>
      <CardContent>
        <form
          id="customForm"
          className="space-y-6"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Selger</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selger_fornavn">Fornavn</Label>
                    <Input
                      id="selger_fornavn"
                      {...formik.getFieldProps("selger_fornavn")}
                    />
                    {formik.touched.selger_fornavn &&
                    formik.errors.selger_fornavn ? (
                      <div className="text-red-500">
                        {formik.errors.selger_fornavn}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_etternavn">Etternavn</Label>
                    <Input
                      id="selger_etternavn"
                      {...formik.getFieldProps("selger_etternavn")}
                    />
                    {formik.touched.selger_etternavn &&
                    formik.errors.selger_etternavn ? (
                      <div className="text-red-500">
                        {formik.errors.selger_etternavn}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_adresse">Adresse</Label>
                  <Input
                    id="selger_adresse"
                    {...formik.getFieldProps("selger_adresse")}
                  />
                  {formik.touched.selger_adresse &&
                  formik.errors.selger_adresse ? (
                    <div className="text-red-500">
                      {formik.errors.selger_adresse}
                    </div>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selger_postnummer">Postnummer</Label>
                    <Input
                      id="selger_postnummer"
                      {...formik.getFieldProps("selger_postnummer")}
                    />
                    {formik.touched.selger_postnummer &&
                    formik.errors.selger_postnummer ? (
                      <div className="text-red-500">
                        {formik.errors.selger_postnummer}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_poststed">Poststed</Label>
                    <Input
                      id="selger_poststed"
                      {...formik.getFieldProps("selger_poststed")}
                    />
                    {formik.touched.selger_poststed &&
                    formik.errors.selger_poststed ? (
                      <div className="text-red-500">
                        {formik.errors.selger_poststed}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_fodselsdato">Person/org.nr</Label>
                  <Input
                    id="selger_fodselsdato"
                    {...formik.getFieldProps("selger_fodselsdato")}
                  />
                  {formik.touched.selger_fodselsdato &&
                  formik.errors.selger_fodselsdato ? (
                    <div className="text-red-500">
                      {formik.errors.selger_fodselsdato}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_tlf_arbeid">Telefon</Label>
                  <Input
                    id="selger_tlf_arbeid"
                    {...formik.getFieldProps("selger_tlf_arbeid")}
                  />
                  {formik.touched.selger_tlf_arbeid &&
                  formik.errors.selger_tlf_arbeid ? (
                    <div className="text-red-500">
                      {formik.errors.selger_tlf_arbeid}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Kjøper</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_fornavn">Fornavn</Label>
                    <Input
                      id="kjoper_fornavn"
                      {...formik.getFieldProps("kjoper_fornavn")}
                    />
                    {formik.touched.kjoper_fornavn &&
                    formik.errors.kjoper_fornavn ? (
                      <div className="text-red-500">
                        {formik.errors.kjoper_fornavn}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_etternavn">Etternavn</Label>
                    <Input
                      id="kjoper_etternavn"
                      {...formik.getFieldProps("kjoper_etternavn")}
                    />
                    {formik.touched.kjoper_etternavn &&
                    formik.errors.kjoper_etternavn ? (
                      <div className="text-red-500">
                        {formik.errors.kjoper_etternavn}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_adresse">Adresse</Label>
                  <Input
                    id="kjoper_adresse"
                    {...formik.getFieldProps("kjoper_adresse")}
                  />
                  {formik.touched.kjoper_adresse &&
                  formik.errors.kjoper_adresse ? (
                    <div className="text-red-500">
                      {formik.errors.kjoper_adresse}
                    </div>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_postnummer">Postnummer</Label>
                    <Input
                      id="kjoper_postnummer"
                      {...formik.getFieldProps("kjoper_postnummer")}
                    />
                    {formik.touched.kjoper_postnummer &&
                    formik.errors.kjoper_postnummer ? (
                      <div className="text-red-500">
                        {formik.errors.kjoper_postnummer}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_poststed">Poststed</Label>
                    <Input
                      id="kjoper_poststed"
                      {...formik.getFieldProps("kjoper_poststed")}
                    />
                    {formik.touched.kjoper_poststed &&
                    formik.errors.kjoper_poststed ? (
                      <div className="text-red-500">
                        {formik.errors.kjoper_poststed}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_fodselsdato">Person/org.nr</Label>
                  <Input
                    id="kjoper_fodselsdato"
                    {...formik.getFieldProps("kjoper_fodselsdato")}
                  />
                  {formik.touched.kjoper_fodselsdato &&
                  formik.errors.kjoper_fodselsdato ? (
                    <div className="text-red-500">
                      {formik.errors.kjoper_fodselsdato}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_tlf_arbeid">Telefon</Label>
                  <Input
                    id="kjoper_tlf_arbeid"
                    {...formik.getFieldProps("kjoper_tlf_arbeid")}
                  />
                  {formik.touched.kjoper_tlf_arbeid &&
                  formik.errors.kjoper_tlf_arbeid ? (
                    <div className="text-red-500">
                      {formik.errors.kjoper_tlf_arbeid}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Kjøretøy</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  formik.errors.omregistreringsavgift_betales_av ? (
                    <div className="text-red-500">
                      {formik.errors.omregistreringsavgift_betales_av}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="omregistreringsavgift_belop">Beløp</Label>
                  <Input
                    id="omregistreringsavgift_belop"
                    {...formik.getFieldProps("omregistreringsavgift_belop")}
                  />
                  {formik.touched.omregistreringsavgift_belop &&
                  formik.errors.omregistreringsavgift_belop ? (
                    <div className="text-red-500">
                      {formik.errors.omregistreringsavgift_belop}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regnr">Reg.nr</Label>
                  <Input id="regnr" {...formik.getFieldProps("regnr")} />
                  {formik.touched.regnr && formik.errors.regnr ? (
                    <div className="text-red-500">{formik.errors.regnr}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilmerke">Bilmerke</Label>
                  <Input id="bilmerke" {...formik.getFieldProps("bilmerke")} />
                  {formik.touched.bilmerke && formik.errors.bilmerke ? (
                    <div className="text-red-500">{formik.errors.bilmerke}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" {...formik.getFieldProps("type")} />
                  {formik.touched.type && formik.errors.type ? (
                    <div className="text-red-500">{formik.errors.type}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arsmodell">Årsmodell</Label>
                  <Input
                    id="arsmodell"
                    {...formik.getFieldProps("arsmodell")}
                  />
                  {formik.touched.arsmodell && formik.errors.arsmodell ? (
                    <div className="text-red-500">
                      {formik.errors.arsmodell}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km_stand">Km stand</Label>
                  <Input id="km_stand" {...formik.getFieldProps("km_stand")} />
                  {formik.touched.km_stand && formik.errors.km_stand ? (
                    <div className="text-red-500">{formik.errors.km_stand}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siste_eu_kontroll">Siste EU-kontroll</Label>
                  <Input
                    id="siste_eu_kontroll"
                    type="date"
                    {...formik.getFieldProps("siste_eu_kontroll")}
                  />
                  {formik.touched.siste_eu_kontroll &&
                  formik.errors.siste_eu_kontroll ? (
                    <div className="text-red-500">
                      {formik.errors.siste_eu_kontroll}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjopesum">Kjøpesum</Label>
                  <Input id="kjopesum" {...formik.getFieldProps("kjopesum")} />
                  {formik.touched.kjopesum && formik.errors.kjopesum ? (
                    <div className="text-red-500">{formik.errors.kjopesum}</div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="betalingsmate">Betalingsmåte</Label>
                  <Input
                    id="betalingsmate"
                    {...formik.getFieldProps("betalingsmate")}
                  />
                  {formik.touched.betalingsmate &&
                  formik.errors.betalingsmate ? (
                    <div className="text-red-500">
                      {formik.errors.betalingsmate}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selgers_kontonummer">
                    Selgers kontonummer
                  </Label>
                  <Input
                    id="selgers_kontonummer"
                    {...formik.getFieldProps("selgers_kontonummer")}
                  />
                  {formik.touched.selgers_kontonummer &&
                  formik.errors.selgers_kontonummer ? (
                    <div className="text-red-500">
                      {formik.errors.selgers_kontonummer}
                    </div>
                  ) : null}
                </div>
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
              <div className="flex space-x-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sted_kjoper">Sted</Label>
              <Input
                id="sted_kjoper"
                {...formik.getFieldProps("sted_kjoper")}
              />
              {formik.touched.sted_kjoper && formik.errors.sted_kjoper ? (
                <div className="text-red-500">{formik.errors.sted_kjoper}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dato_kjoper">Dato</Label>
              <Input
                id="dato_kjoper"
                type="date"
                {...formik.getFieldProps("dato_kjoper")}
              />
              {formik.touched.dato_kjoper && formik.errors.dato_kjoper ? (
                <div className="text-red-500">{formik.errors.dato_kjoper}</div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selgers_underskrift">Selgers underskrift</Label>
              <Input
                id="selgers_underskrift"
                {...formik.getFieldProps("selgers_underskrift")}
              />
              {formik.touched.selgers_underskrift &&
              formik.errors.selgers_underskrift ? (
                <div className="text-red-500">
                  {formik.errors.selgers_underskrift}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kjopers_underskrift">Kjøpers underskrift</Label>
              <Input
                id="kjopers_underskrift"
                // {...formik.getFieldProps("kjopers_underskrift")}
              />
              {formik.touched.kjopers_underskrift &&
              formik.errors.kjopers_underskrift ? (
                <div className="text-red-500">
                  {formik.errors.kjopers_underskrift}
                </div>
              ) : null}
            </div>
          </div>

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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || balance === null || balance < 9.9}
          >
            {getButtonText()}
          </Button>
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

export default PurchaseContractForm;

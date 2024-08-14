import React, { useState, ChangeEvent, ClipboardEvent } from "react";
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
}

const PurchaseContractForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const sanitizedText = pastedText
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const target = e.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = target;
    const currentValue = target.value;
    const newValue =
      currentValue.slice(0, selectionStart) +
      sanitizedText +
      currentValue.slice(selectionEnd);

    setFormData((prevData) => ({
      ...prevData,
      [target.name]: newValue,
    }));
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

      generatePDF(formData);
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(`Withdrawal failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    handleWithdraw();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Kjøpskontrakt</h2>
      </CardHeader>
      <CardContent>
        <form id="customForm" className="space-y-6">
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
                      name="selger_fornavn"
                      value={formData.selger_fornavn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_etternavn">Etternavn</Label>
                    <Input
                      id="selger_etternavn"
                      name="selger_etternavn"
                      value={formData.selger_etternavn}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_adresse">Adresse</Label>
                  <Input
                    id="selger_adresse"
                    name="selger_adresse"
                    value={formData.selger_adresse}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="selger_postnummer">Postnummer</Label>
                    <Input
                      id="selger_postnummer"
                      name="selger_postnummer"
                      value={formData.selger_postnummer}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selger_poststed">Poststed</Label>
                    <Input
                      id="selger_poststed"
                      name="selger_poststed"
                      value={formData.selger_poststed}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_fodselsdato">Person/org.nr</Label>
                  <Input
                    id="selger_fodselsdato"
                    name="selger_fodselsdato"
                    value={formData.selger_fodselsdato}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selger_tlf_arbeid">Telefon</Label>
                  <Input
                    id="selger_tlf_arbeid"
                    name="selger_tlf_arbeid"
                    value={formData.selger_tlf_arbeid}
                    onChange={handleInputChange}
                  />
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
                      name="kjoper_fornavn"
                      value={formData.kjoper_fornavn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_etternavn">Etternavn</Label>
                    <Input
                      id="kjoper_etternavn"
                      name="kjoper_etternavn"
                      value={formData.kjoper_etternavn}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_adresse">Adresse</Label>
                  <Input
                    id="kjoper_adresse"
                    name="kjoper_adresse"
                    value={formData.kjoper_adresse}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_postnummer">Postnummer</Label>
                    <Input
                      id="kjoper_postnummer"
                      name="kjoper_postnummer"
                      value={formData.kjoper_postnummer}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kjoper_poststed">Poststed</Label>
                    <Input
                      id="kjoper_poststed"
                      name="kjoper_poststed"
                      value={formData.kjoper_poststed}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_fodselsdato">Person/org.nr</Label>
                  <Input
                    id="kjoper_fodselsdato"
                    name="kjoper_fodselsdato"
                    value={formData.kjoper_fodselsdato}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjoper_tlf_arbeid">Telefon</Label>
                  <Input
                    id="kjoper_tlf_arbeid"
                    name="kjoper_tlf_arbeid"
                    value={formData.kjoper_tlf_arbeid}
                    onChange={handleInputChange}
                  />
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
                    value={formData.omregistreringsavgift_betales_av}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="omregistreringsavgift_belop">Beløp</Label>
                  <Input
                    id="omregistreringsavgift_belop"
                    name="omregistreringsavgift_belop"
                    value={formData.omregistreringsavgift_belop}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regnr">Reg.nr</Label>
                  <Input
                    id="regnr"
                    name="regnr"
                    value={formData.regnr}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilmerke">Bilmerke</Label>
                  <Input
                    id="bilmerke"
                    name="bilmerke"
                    value={formData.bilmerke}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arsmodell">Årsmodell</Label>
                  <Input
                    id="arsmodell"
                    name="arsmodell"
                    value={formData.arsmodell}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km_stand">Km stand</Label>
                  <Input
                    id="km_stand"
                    name="km_stand"
                    value={formData.km_stand}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siste_eu_kontroll">Siste EU-kontroll</Label>
                  <Input
                    id="siste_eu_kontroll"
                    name="siste_eu_kontroll"
                    type="date"
                    value={formData.siste_eu_kontroll}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kjopesum">Kjøpesum</Label>
                  <Input
                    id="kjopesum"
                    name="kjopesum"
                    value={formData.kjopesum}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="betalingsmate">Betalingsmåte</Label>
                  <Input
                    id="betalingsmate"
                    name="betalingsmate"
                    value={formData.betalingsmate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selgers_kontonummer">
                    Selgers kontonummer
                  </Label>
                  <Input
                    id="selgers_kontonummer"
                    name="selgers_kontonummer"
                    value={formData.selgers_kontonummer}
                    onChange={handleInputChange}
                  />
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
                    checked={formData.utstyr_sommer}
                    onCheckedChange={handleCheckboxChange("utstyr_sommer")}
                  />
                  <Label htmlFor="utstyr_sommer">Sommerhjul</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utstyr_vinter"
                    checked={formData.utstyr_vinter}
                    onCheckedChange={handleCheckboxChange("utstyr_vinter")}
                  />
                  <Label htmlFor="utstyr_vinter">Vinterhjul</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utstyr_annet"
                    checked={formData.utstyr_annet}
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
                  name="utstyr_spesifisert"
                  value={formData.utstyr_spesifisert}
                  onChange={handleInputChange}
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
                name="andre_kommentarer"
                value={formData.andre_kommentarer}
                onChange={handleInputChange}
                onPaste={handlePaste}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sted_kjoper">Sted</Label>
              <Input
                id="sted_kjoper"
                name="sted_kjoper"
                value={formData.sted_kjoper}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dato_kjoper">Dato</Label>
              <Input
                id="dato_kjoper"
                name="dato_kjoper"
                type="date"
                value={formData.dato_kjoper}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selgers_underskrift">Selgers underskrift</Label>
              <Input
                id="selgers_underskrift"
                name="selgers_underskrift"
                value={formData.selgers_underskrift}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kjopers_underskrift">Kjøpers underskrift</Label>
              <Input
                id="kjopers_underskrift"
                name="kjopers_underskrift"
                value={formData.kjopers_underskrift}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button
            onClick={handleGeneratePDF}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Genererer..." : "Generer PDF (kr 9.90.-)"}
          </Button>

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">{success}</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseContractForm;

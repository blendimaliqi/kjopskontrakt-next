import React, { useState, ChangeEvent, ClipboardEvent } from "react";
import styles from "../styles/PurchaseContractForm.module.css";
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
        body: JSON.stringify({ amount: 9 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred");
      }

      setSuccess(
        `Withdrawal successful! New balance: $${data.balance.toFixed(2)}`
      );

      generatePDF(formData);
      //  setAmount(0); // Reset amount after successful withdrawal
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
    <form id="customForm" className={styles.form}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={2}>Selger</th>
            <th colSpan={2}>Kjøper</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Selger Fornavn">
              <input
                type="text"
                name="selger_fornavn"
                placeholder="Fornavn"
                value={formData.selger_fornavn}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Selger Etternavn">
              <input
                type="text"
                name="selger_etternavn"
                placeholder="Etternavn"
                value={formData.selger_etternavn}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Fornavn">
              <input
                type="text"
                name="kjoper_fornavn"
                placeholder="Fornavn"
                value={formData.kjoper_fornavn}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Etternavn">
              <input
                type="text"
                name="kjoper_etternavn"
                placeholder="Etternavn"
                value={formData.kjoper_etternavn}
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} data-label="Selger Adresse">
              <input
                type="text"
                name="selger_adresse"
                placeholder="Adresse"
                value={formData.selger_adresse}
                onChange={handleInputChange}
              />
            </td>
            <td colSpan={2} data-label="Kjøper Adresse">
              <input
                type="text"
                name="kjoper_adresse"
                placeholder="Adresse"
                value={formData.kjoper_adresse}
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td data-label="Selger Postnummer">
              <input
                type="text"
                name="selger_postnummer"
                placeholder="Postnummer"
                value={formData.selger_postnummer}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Selger Poststed">
              <input
                type="text"
                name="selger_poststed"
                placeholder="Poststed"
                value={formData.selger_poststed}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Postnummer">
              <input
                type="text"
                name="kjoper_postnummer"
                placeholder="Postnummer"
                value={formData.kjoper_postnummer}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Poststed">
              <input
                type="text"
                name="kjoper_poststed"
                placeholder="Poststed"
                value={formData.kjoper_poststed}
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td data-label="Selger Person/org.nr">
              <input
                type="text"
                name="selger_fodselsdato"
                placeholder="Person/org.nr"
                value={formData.selger_fodselsdato}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Selger Telefon">
              <input
                type="text"
                name="selger_tlf_arbeid"
                placeholder="Telefon"
                value={formData.selger_tlf_arbeid}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Person/org.nr">
              <input
                type="text"
                name="kjoper_fodselsdato"
                placeholder="Person/org.nr"
                value={formData.kjoper_fodselsdato}
                onChange={handleInputChange}
              />
            </td>
            <td data-label="Kjøper Telefon">
              <input
                type="text"
                name="kjoper_tlf_arbeid"
                placeholder="Telefon"
                value={formData.kjoper_tlf_arbeid}
                onChange={handleInputChange}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Kjøretøy</h3>
      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="omregistreringsavgift_betales_av">
            Omregistreringsavgift betales av:
          </label>
          <select
            id="omregistreringsavgift_betales_av"
            name="omregistreringsavgift_betales_av"
            value={formData.omregistreringsavgift_betales_av}
            onChange={handleInputChange}
          >
            <option value="kjoper">Kjøper</option>
            <option value="selger">Selger</option>
          </select>
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="omregistreringsavgift_belop">Beløp:</label>
          <input
            type="text"
            id="omregistreringsavgift_belop"
            name="omregistreringsavgift_belop"
            value={formData.omregistreringsavgift_belop}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="regnr">Reg.nr:</label>
          <input
            type="text"
            id="regnr"
            name="regnr"
            value={formData.regnr}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="bilmerke">Bilmerke:</label>
          <input
            type="text"
            id="bilmerke"
            name="bilmerke"
            value={formData.bilmerke}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="arsmodell">Årsmodell:</label>
          <input
            type="text"
            id="arsmodell"
            name="arsmodell"
            value={formData.arsmodell}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="km_stand">Km stand:</label>
          <input
            type="text"
            id="km_stand"
            name="km_stand"
            value={formData.km_stand}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="siste_eu_kontroll">Siste EU-kontroll:</label>
          <input
            type="date"
            id="siste_eu_kontroll"
            name="siste_eu_kontroll"
            value={formData.siste_eu_kontroll}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="kjopesum">Kjøpesum:</label>
          <input
            type="text"
            id="kjopesum"
            name="kjopesum"
            value={formData.kjopesum}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="betalingsmate">Betalingsmåte:</label>
          <input
            type="text"
            id="betalingsmate"
            name="betalingsmate"
            value={formData.betalingsmate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="selgers_kontonummer">Selgers kontonummer:</label>
          <input
            type="text"
            id="selgers_kontonummer"
            name="selgers_kontonummer"
            value={formData.selgers_kontonummer}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3>Utstyr inkludert i kjøpesum:</h3>
      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            name="utstyr_sommer"
            checked={formData.utstyr_sommer}
            onChange={handleInputChange}
          />{" "}
          Sommerhjul
        </label>
        <label>
          <input
            type="checkbox"
            name="utstyr_vinter"
            checked={formData.utstyr_vinter}
            onChange={handleInputChange}
          />{" "}
          Vinterhjul
        </label>
        <label>
          <input
            type="checkbox"
            name="utstyr_annet"
            checked={formData.utstyr_annet}
            onChange={handleInputChange}
          />{" "}
          Annet
        </label>
      </div>

      <label htmlFor="utstyr_spesifisert">Hvis ja, vennligst spesifiser:</label>
      <textarea
        id="utstyr_spesifisert"
        name="utstyr_spesifisert"
        rows={4}
        value={formData.utstyr_spesifisert}
        onChange={handleInputChange}
        onPaste={handlePaste}
        className={styles.monospaceTextarea}
      ></textarea>

      <h3>Andre kommentarer / vilkår:</h3>
      <textarea
        name="andre_kommentarer"
        rows={4}
        value={formData.andre_kommentarer}
        onChange={handleInputChange}
        onPaste={handlePaste}
        className={styles.monospaceTextarea}
      ></textarea>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="sted_kjoper">Sted</label>
          <input
            type="text"
            id="sted_kjoper"
            name="sted_kjoper"
            value={formData.sted_kjoper}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="dato_kjoper">Dato</label>
          <input
            type="date"
            id="dato_kjoper"
            name="dato_kjoper"
            value={formData.dato_kjoper}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label htmlFor="selgers_underskrift">Selgers underskrift:</label>
          <input
            type="text"
            id="selgers_underskrift"
            name="selgers_underskrift"
            value={formData.selgers_underskrift}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formColumn}>
          <label htmlFor="kjopers_underskrift">Kjøpers underskrift:</label>
          <input
            type="text"
            id="kjopers_underskrift"
            name="kjopers_underskrift"
            value={formData.kjopers_underskrift}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleGeneratePDF}
        className={styles.generateButton}
      >
        Generate PDF
      </button>
    </form>
  );
};

export default PurchaseContractForm;

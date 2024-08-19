import { generatePDF } from "./pdfGenerator";

// Define the FormData interface explicitly in this file
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

const dummyData: FormData = {
  selger_fornavn: "Ola",
  selger_etternavn: "Nordmann",
  selger_adresse: "Kongens gate 1",
  selger_postnummer: "0153",
  selger_poststed: "Oslo",
  selger_fodselsdato: "17.05.1980",
  selger_tlf_arbeid: "22334455",
  kjoper_fornavn: "Kari",
  kjoper_etternavn: "Hansen",
  kjoper_adresse: "Slottsplassen 1",
  kjoper_postnummer: "0010",
  kjoper_poststed: "Oslo",
  kjoper_fodselsdato: "24.12.1985",
  kjoper_tlf_arbeid: "99887766",
  regnr: "AB12345",
  bilmerke: "Volvo",
  type: "XC90",
  arsmodell: "2019",
  km_stand: "50000",
  siste_eu_kontroll: "01.03.2023",
  kjopesum: "450000",
  betalingsmate: "Bankoverføring",
  selgers_kontonummer: "1234.56.78901",
  omregistreringsavgift_betales_av: "kjoper",
  omregistreringsavgift_belop: "2850",
  utstyr_sommer: true,
  utstyr_vinter: true,
  utstyr_annet: true,
  utstyr_spesifisert: "Takstativ, skiboks, og barnesete",
  andre_kommentarer:
    "Bilen er nylig servicert og har fått nye bremseskiver. Den er i meget god stand og har vært røykfri.",
  sted_kjoper: "Oslo",
  dato_kjoper: "15.08.2023",
  selgers_underskrift: "Ola Nordmann",
  kjopers_underskrift: "Kari Hansen",
  include_disclaimer: true,
};

export function generateDemoPDF(): void {
  generatePDF(dummyData);
}

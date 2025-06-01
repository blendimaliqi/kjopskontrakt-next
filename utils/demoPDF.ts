import { generatePDF } from "./pdfGenerator";

// Define the FormData interface explicitly in this file
interface FormData {
  selger_fornavn: string;
  selger_etternavn: string;
  selger_bedriftsnavn: string;
  selger_er_bedrift: boolean;
  selger_adresse: string;
  selger_postnummer: string;
  selger_poststed: string;
  selger_fodselsdato: string;
  selger_tlf_arbeid: string;
  kjoper_fornavn: string;
  kjoper_etternavn: string;
  kjoper_bedriftsnavn: string;
  kjoper_er_bedrift: boolean;
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
  har_bilen_heftelser?: "ja" | "nei" | "velg" | "";
  er_bilen_provekjort?: "ja" | "nei" | "velg" | "";
  include_company_info?: boolean;
  primary_color?: string;
  company_name?: string;
  company_address?: string;
  company_email?: string;
  company_phone?: string;
  company_logo_base64?: string;
  custom_header_text?: string;
}

const dummyData: FormData = {
  selger_fornavn: "Ola",
  selger_etternavn: "Nordmann",
  selger_bedriftsnavn: "",
  selger_er_bedrift: false,
  selger_adresse: "Kongens gate 1",
  selger_postnummer: "0153",
  selger_poststed: "Oslo",
  selger_fodselsdato: "17.05.1980",
  selger_tlf_arbeid: "22334455",
  kjoper_fornavn: "Kari",
  kjoper_etternavn: "Hansen",
  kjoper_bedriftsnavn: "",
  kjoper_er_bedrift: false,
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
  utstyr_spesifisert: "Takstativ, skiboks",
  andre_kommentarer: "Bilen er nylig servicert og har fått nye bremseskiver.",
  sted_selger: "Oslo",
  dato_selger: "15.08.2023",
  sted_kjoper: "Oslo",
  dato_kjoper: "15.08.2023",
  selgers_underskrift: "Ola Nordmann",
  kjopers_underskrift: "Kari Hansen",
  include_disclaimer: true,
  har_bilen_heftelser: "nei",
  er_bilen_provekjort: "ja",
  include_company_info: false,
  primary_color: "#1e336c",
};

export function generateDemoPDF(): void {
  // Create a copy of the dummy data and add company info
  const dummyDataWithCompany = {
    ...dummyData,
    include_company_info: true,
    company_name: "Ditt Firma AS",
    company_address: "Firmabakken 24",
    company_email: "post@dittfirma.no",
    company_phone: "+47 12345678",
    primary_color: "#1E3369",
  };

  // Load the logo as base64
  if (typeof window !== "undefined") {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");

      // Now generate the PDF with the logo
      dummyDataWithCompany.company_logo_base64 = dataURL;
      generatePDF(dummyDataWithCompany);
    };
    img.onerror = function () {
      console.error("Error loading logo");
      // Generate PDF without logo if there's an error
      generatePDF(dummyDataWithCompany);
    };
    img.src = "/borgen.png";
  } else {
    // Fallback for server-side
    generatePDF(dummyDataWithCompany);
  }
}

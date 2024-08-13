import jsPDF from "jspdf";

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

export function generatePDF(formData: FormData): void {
  const doc = new jsPDF();

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let yPosition = margin;

  function addText(
    text: string,
    x: number,
    y: number,
    size: number = 10,
    style: string = "normal",
    align: "left" | "center" | "right" = "left",
    maxWidth?: number
  ): number {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    if (maxWidth) {
      const textLines = doc.splitTextToSize(text, maxWidth);
      doc.text(textLines, x, y, { align });
      return textLines.length;
    } else {
      doc.text(text, x, y, { align });
      return 1;
    }
  }

  function addField(
    label: string,
    value: string,
    x: number,
    y: number,
    width: number = 50,
    multiline: boolean = false
  ): number {
    addText(label, x, y - 5, 8);
    doc.line(x, y, x + width, y);
    if (multiline) {
      return addText(value, x, y + 5, 10, "normal", "left", width) * 5;
    } else {
      addText(value, x, y - 1, 10);
      return 0;
    }
  }

  function addCheckbox(
    label: string,
    checked: boolean,
    x: number,
    y: number
  ): void {
    doc.rect(x, y - 3, 3, 3);
    if (checked) {
      doc.line(x, y - 3, x + 3, y);
      doc.line(x, y, x + 3, y - 3);
    }
    addText(label, x + 5, y, 8);
  }

  function addPage(): void {
    doc.addPage();
    yPosition = margin;
  }

  // Title
  yPosition += 5;
  addText("Kjøpskontrakt", pageWidth / 2, yPosition, 16, "bold", "center");
  doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5);
  yPosition += 20;

  // Personlige opplysninger
  addText("Personlige opplysninger", margin, yPosition, 12, "bold", "left");

  // Seller and Buyer sections
  const sectionWidth = (pageWidth - 2 * margin - 10) / 2;

  // Add grey background for both Selger and Kjøper
  doc.setFillColor(240, 240, 240);
  const greyBackgroundHeight = 10;
  const greyBackgroundPadding = 5;
  yPosition += greyBackgroundPadding;
  doc.rect(margin, yPosition, sectionWidth, greyBackgroundHeight, "F");
  doc.rect(
    margin + sectionWidth + 10,
    yPosition,
    sectionWidth,
    greyBackgroundHeight,
    "F"
  );

  // Add Selger and Kjøper titles
  addText("Selger", margin + 2, yPosition + 7, 10, "bold");
  addText("Kjøper", margin + sectionWidth + 12, yPosition + 7, 10, "bold");

  yPosition += greyBackgroundHeight + 7 + greyBackgroundPadding;

  const fields = [
    ["fornavn", "Fornavn"],
    ["etternavn", "Etternavn"],
    ["adresse", "Adresse"],
    ["postnummer", "Postnummer"],
    ["poststed", "Poststed"],
    ["fodselsdato", "Person/org.nr"],
    ["tlf_arbeid", "Telefon"],
  ];

  fields.forEach(([fieldName, label]) => {
    // Selger column
    addField(
      label,
      formData[`selger_${fieldName}` as keyof FormData] as string,
      margin,
      yPosition,
      sectionWidth - 5
    );

    // Kjøper column
    addField(
      label,
      formData[`kjoper_${fieldName}` as keyof FormData] as string,
      margin + sectionWidth + 10,
      yPosition,
      sectionWidth - 5
    );

    yPosition += 10;
  });

  // Kjøretøy
  yPosition += 5 + greyBackgroundPadding;
  doc.setFillColor(240, 240, 240);
  const vehicleSectionHeight = 10;
  doc.rect(
    margin,
    yPosition,
    pageWidth - 2 * margin,
    vehicleSectionHeight,
    "F"
  );
  addText("Kjøretøy", margin + 2, yPosition + 7, 12, "bold");
  yPosition += vehicleSectionHeight + 7 + greyBackgroundPadding;

  const vehicleFields = [
    [
      ["regnr", "Reg.nr"],
      ["bilmerke", "Bilmerke"],
      ["type", "Type"],
    ],
    [
      ["km_stand", "Km stand"],
      ["siste_eu_kontroll", "Siste EU-kontroll"],
      ["arsmodell", "Årsmodell"],
    ],
    [
      ["kjopesum", "Kjøpesum"],
      ["betalingsmate", "Betalingsmåte"],
    ],
    [["selgers_kontonummer", "Selgers kontonummer"]],
    [
      ["omregistreringsavgift_betales_av", "Omregistreringsavgift betales av"],
      ["omregistreringsavgift_belop", "Beløp"],
    ],
  ];

  vehicleFields.forEach((row) => {
    const fieldWidth =
      (pageWidth - 2 * margin - (row.length - 1) * 5) / row.length;
    row.forEach(([fieldName, label], index) => {
      let value = formData[fieldName as keyof FormData] as string;
      if (fieldName === "omregistreringsavgift_betales_av") {
        value =
          value === "kjoper" ? "Kjøper" : value === "selger" ? "Selger" : "";
      }
      addField(
        label,
        value,
        margin + index * (fieldWidth + 5),
        yPosition,
        fieldWidth
      );
    });
    yPosition += 10;
  });

  // Utstyr inkludert i kjøpesum
  yPosition += 10;

  if (yPosition > pageHeight - margin * 2) {
    addPage();
  }

  addText("Utstyr inkludert i kjøpesum:", margin, yPosition, 10, "bold");
  yPosition += 10;

  const utstyrItems = [
    ["utstyr_sommer", "Sommerhjul"],
    ["utstyr_vinter", "Vinterhjul"],
    ["utstyr_annet", "Annet"],
  ];

  utstyrItems.forEach(([fieldName, label], index) => {
    addCheckbox(
      label,
      formData[fieldName as keyof FormData] as boolean,
      margin + index * 45,
      yPosition
    );
  });

  yPosition += 15;
  const utstyrSpecHeight = addField(
    "Hvis ja, vennligst spesifiser",
    formData.utstyr_spesifisert,
    margin,
    yPosition,
    pageWidth - 2 * margin,
    true
  );
  yPosition += utstyrSpecHeight + 10;

  if (yPosition > pageHeight - margin * 2) {
    addPage();
  }

  // Andre kommentarer / vilkår
  addText("Andre kommentarer / vilkår:", margin, yPosition, 10, "bold");
  yPosition += 10;
  const kommentarerLines = addText(
    formData.andre_kommentarer,
    margin,
    yPosition,
    10,
    "normal",
    "left",
    pageWidth - 2 * margin
  );
  yPosition += kommentarerLines * 5 + 10;

  // Signatures
  if (yPosition > pageHeight - margin * 4) {
    addPage();
  }

  const signatureFields = [
    ["selgers_underskrift", "Selgers underskrift"],
    ["sted_kjoper", "Sted"],
    ["dato_kjoper", "Dato"],
    ["kjopers_underskrift", "Kjøpers underskrift"],
  ];

  signatureFields.forEach(([fieldName, label], index) => {
    const x = index < 3 ? margin : pageWidth / 2;
    const y = yPosition + (index % 3) * 15;
    addField(
      label,
      formData[fieldName as keyof FormData] as string,
      x,
      y,
      (pageWidth - 2 * margin - 10) / 2
    );
  });

  // Add small text below the signature fields
  addText(
    "Kjøper er informert/opplyst og pliktet seg til og undersøke og sette seg inn i sevicehistorikk, kosmetiske skader, funksjonsteste knapper og mediestystemer og prøvekjørt bilen. Utstyrsliste kontrolleres av kjøper, åpenbare synlige mangler fra annonsert utstyr kan ikke reklameres på etter kjøp. Kjøpet skjer i de betingelser som er opplyst i vedlakt dokument. Sikkerhetsinnretninger følger bilens prodoksujnsdato om ikke annet er er angitt under spesielle vilkår. Kjøper bekrefter ved sin underskrift å ha gjort seg kjent med, og godtar disse",
    margin,
    yPosition + 45,
    8,
    "normal",
    "left",
    pageWidth - 2 * margin
  );

  // Add page border
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.rect(
      margin - 5,
      margin - 5,
      pageWidth - 2 * margin + 10,
      pageHeight - 2 * margin + 10
    );
  }

  // Save the PDF
  doc.save("kjøpskontrakt.pdf");
}

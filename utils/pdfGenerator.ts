import jsPDF from "jspdf";
import "jspdf-autotable";

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
  company_name?: string;
  company_address?: string;
  company_email?: string;
  company_phone?: string;
  company_logo?: File | null;
  company_logo_base64?: string;
  include_company_info?: boolean;
  custom_header_text?: string;
  primary_color?: string;
}

export function generatePDF(formData: FormData): void {
  // Create a new PDF document with larger margins
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let yPosition = margin;

  // Use the navy blue color shown in the image
  const defaultColorRGB: [number, number, number] = [30, 51, 105];

  // Parse the hex color to RGB if provided
  let primaryColorRGB: [number, number, number] = defaultColorRGB;
  if (formData.primary_color) {
    try {
      // Ensure the color is properly formatted and trim any whitespace
      const colorValue = formData.primary_color.trim();
      // Handle colors with or without the # prefix
      const hex = colorValue.startsWith("#")
        ? colorValue.substring(1)
        : colorValue;

      if (hex.length === 6) {
        // Parse each color component (R, G, B)
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Validate that all values are valid numbers between 0-255
        if (
          !isNaN(r) &&
          !isNaN(g) &&
          !isNaN(b) &&
          r >= 0 &&
          r <= 255 &&
          g >= 0 &&
          g <= 255 &&
          b >= 0 &&
          b <= 255
        ) {
          primaryColorRGB = [r, g, b];
          console.log(
            `Using custom color: RGB(${r}, ${g}, ${b}) from HEX #${hex}`
          );
        } else {
          console.warn(`Invalid color values in: #${hex}, using default color`);
        }
      } else {
        console.warn(
          `Invalid hex color length (${hex.length}), should be 6 characters. Using default.`
        );
      }
    } catch (error) {
      console.error("Error parsing primary color:", error);
      console.log("Color value received:", formData.primary_color);
    }
  } else {
    console.log("No primary color provided, using default");
  }

  // Secondary color for alternating rows and accents - light blue
  const secondaryColorRGB: [number, number, number] = [240, 245, 252];
  // Dark background color for footer
  const darkBackgroundRGB: [number, number, number] = [48, 48, 48];

  // Function to add text
  function addText(
    text: string,
    x: number,
    y: number,
    size: number = 10,
    style: string = "normal",
    align: "left" | "center" | "right" = "left",
    maxWidth?: number,
    color: [number, number, number] = [60, 60, 60]
  ): number {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(color[0], color[1], color[2]);

    if (maxWidth) {
      const textLines = doc.splitTextToSize(text, maxWidth);
      doc.text(textLines, x, y, { align });
      return textLines.length;
    } else {
      doc.text(text, x, y, { align });
      return 1;
    }
  }

  // Function to add a section header (match the design from the image)
  function addSectionHeader(text: string, y: number): number {
    // Add full-width header background
    const gradientWidth = pageWidth - 2 * margin;
    doc.setFillColor(
      primaryColorRGB[0],
      primaryColorRGB[1],
      primaryColorRGB[2]
    );
    doc.rect(margin, y - 5, gradientWidth, 12, "F");

    // Add the section header text in white
    addText(
      text,
      margin + 5,
      y + 1.5,
      11,
      "bold",
      "left",
      undefined,
      [255, 255, 255]
    );
    return y + 12;
  }

  // Function to add a simple field with proper spacing as shown in the image
  function addField(
    label: string,
    value: string,
    x: number,
    y: number,
    width: number = 50,
    multiline: boolean = false
  ): number {
    // Position the label slightly above the field with proper spacing
    addText(label, x, y, 8, "normal", "left", undefined, [80, 80, 80]);

    // Calculate position for input field with optimal spacing from label
    const fieldY = y + 3.5;

    // Add field background
    doc.setFillColor(245, 245, 250);

    // Add field border
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);

    const fieldHeight = multiline ? 15 : 6;
    doc.rect(x, fieldY, width, fieldHeight, "FD");

    if (multiline) {
      return (
        addText(value, x + 2, fieldY + 4, 9, "normal", "left", width - 4) * 5 +
        5
      );
    } else {
      addText(value, x + 2, fieldY + 4, 9, "normal", "left");
      return fieldHeight + 7; // Reduced from 10 to 7 to reduce space between fields
    }
  }

  // Function to add a checkbox as seen in the image
  function addCheckbox(
    label: string,
    checked: boolean,
    x: number,
    y: number
  ): void {
    // Draw square checkbox (as shown in image)
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.2);
    doc.rect(x, y - 3, 4, 4, "S");

    // Fill checkbox if checked
    if (checked) {
      doc.setFillColor(
        primaryColorRGB[0],
        primaryColorRGB[1],
        primaryColorRGB[2]
      );
      doc.rect(x, y - 3, 4, 4, "F");

      // Add a checkmark
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.line(x + 0.8, y - 1, x + 1.6, y + 0.2);
      doc.line(x + 1.6, y + 0.2, x + 3.2, y - 2);
    }

    addText(label, x + 6, y, 9, "normal", "left");
  }

  // Function to add a new page
  function addPage(): void {
    doc.addPage();
    yPosition = margin;

    // Add header if company info is enabled - make it smaller on subsequent pages
    if (formData.include_company_info && formData.company_name) {
      addCompanyHeader(true);
    }

    // Add page border
    addPageBorder();
  }

  // Function to add a page border
  function addPageBorder(): void {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.rect(
      margin - 5,
      margin - 5,
      pageWidth - 2 * margin + 10,
      pageHeight - 2 * margin + 10,
      "S"
    );
  }

  // Function to add company header - with option for smaller header on subsequent pages
  function addCompanyHeader(isSecondaryPage = false): void {
    let logoHeight = 0;
    const headerHeight = isSecondaryPage ? 25 : 35;

    // Create a clean white background for the header
    doc.setFillColor(255, 255, 255);

    // Add company logo if provided as base64
    if (formData.company_logo_base64) {
      try {
        // Make logo smaller on subsequent pages
        const logoWidth = isSecondaryPage ? 25 : 35;
        logoHeight = isSecondaryPage ? 15 : 20;

        // Calculate logo position (right aligned as in the image)
        const logoX = pageWidth - margin - logoWidth;
        const logoY = margin;

        doc.addImage(
          formData.company_logo_base64,
          "AUTO",
          logoX,
          logoY,
          logoWidth,
          logoHeight
        );
      } catch (error) {
        console.error("Error adding logo to PDF:", error);
      }
    }

    // Add a blue vertical line on the left (similar to the one in the image)
    doc.setFillColor(
      primaryColorRGB[0],
      primaryColorRGB[1],
      primaryColorRGB[2]
    );
    doc.rect(margin - 5, margin - 5, 2, headerHeight, "F");

    // Add company name and information
    const infoX = margin + 5;
    let infoY = margin + 6;

    // Use smaller text on subsequent pages
    const nameSize = isSecondaryPage ? 12 : 14;
    const infoSize = isSecondaryPage ? 8 : 9;

    if (formData.company_name) {
      addText(
        formData.company_name,
        infoX,
        infoY,
        nameSize,
        "bold",
        "left",
        undefined,
        primaryColorRGB
      );
      infoY += isSecondaryPage ? 6 : 8;
    }

    if (formData.company_address) {
      addText(
        formData.company_address,
        infoX,
        infoY,
        infoSize,
        "normal",
        "left"
      );
      infoY += isSecondaryPage ? 4 : 6;
    }

    // Add company email and phone
    if (formData.company_email || formData.company_phone) {
      let contactInfo = "";

      if (formData.company_email && formData.company_phone) {
        contactInfo = `E-post: ${formData.company_email} | Tlf: ${formData.company_phone}`;
      } else if (formData.company_email) {
        contactInfo = `E-post: ${formData.company_email}`;
      } else if (formData.company_phone) {
        contactInfo = `Tlf: ${formData.company_phone}`;
      }

      if (contactInfo) {
        addText(contactInfo, infoX, infoY, infoSize, "normal", "left");
        infoY += isSecondaryPage ? 4 : 6;
      }
    }

    // Add some spacing after the header
    const headerSpacing = isSecondaryPage ? 8 : 15;

    // Update the yPosition to below the header
    yPosition = Math.max(
      infoY + headerSpacing,
      margin + headerHeight + (isSecondaryPage ? 5 : 10)
    );
  }

  // Add company information if enabled
  if (formData.include_company_info) {
    addCompanyHeader();
  } else {
    // Add page border
    addPageBorder();
  }

  // Add title
  yPosition += 5;
  const titleText = formData.custom_header_text || "KJØPEKONTRAKT";

  // Add a clean background for the title
  doc.setFillColor(primaryColorRGB[0], primaryColorRGB[1], primaryColorRGB[2]);
  doc.rect(pageWidth / 2 - 50, yPosition - 8, 100, 14, "F");

  // Add title text in white
  addText(
    titleText.toUpperCase(),
    pageWidth / 2,
    yPosition + 1,
    14,
    "bold",
    "center",
    undefined,
    [255, 255, 255]
  );

  yPosition += 20;

  // Add the date on the right with an elegant format
  const today = formData.dato_kjoper
    ? new Date(formData.dato_kjoper)
    : new Date();
  const dateStr = today.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setDrawColor(220, 220, 220);
  doc.rect(pageWidth - margin - 60, yPosition - 5, 60, 8, "S");
  addText(
    `Dato: ${dateStr}`,
    pageWidth - margin - 30,
    yPosition,
    9,
    "normal",
    "center"
  );

  yPosition += 15;

  // --- Person Information ---
  yPosition = addSectionHeader("PERSONOPPLYSNINGER", yPosition);
  yPosition += 10;

  // Seller and Buyer sections - match the spacing seen in the image
  const sectionWidth = (pageWidth - 2 * margin - 10) / 2;

  // SELGER Header - match the color and style in the image
  doc.setFillColor(primaryColorRGB[0], primaryColorRGB[1], primaryColorRGB[2]);
  doc.rect(margin, yPosition - 2, sectionWidth, 8, "F");
  addText(
    "SELGER",
    margin + sectionWidth / 2,
    yPosition + 3,
    10,
    "bold",
    "center",
    undefined,
    [255, 255, 255]
  );

  // KJØPER Header - match the color and style in the image
  doc.setFillColor(primaryColorRGB[0], primaryColorRGB[1], primaryColorRGB[2]);
  doc.rect(margin + sectionWidth + 10, yPosition - 2, sectionWidth, 8, "F");
  addText(
    "KJØPER",
    margin + sectionWidth + 10 + sectionWidth / 2,
    yPosition + 3,
    10,
    "bold",
    "center",
    undefined,
    [255, 255, 255]
  );

  yPosition += 14; // Reduced from 16 to 14

  // Person fields with refined spacing
  const personFields = [
    ["fornavn", "Fornavn"],
    ["etternavn", "Etternavn"],
    ["adresse", "Adresse"],
    ["postnummer", "Postnummer"],
    ["poststed", "Poststed"],
    ["fodselsdato", "Person/org.nr"],
    ["tlf_arbeid", "Telefon"],
  ];

  personFields.forEach(([fieldName, label], index) => {
    // Check if we need to add a new page before the field
    if (yPosition > pageHeight - 60) {
      addPage();
      // Add a section header to remind user what section they're in
      yPosition = addSectionHeader("PERSONOPPLYSNINGER (fortsatt)", yPosition);
      yPosition += 10;
    }

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

    // Optimized spacing between fields
    yPosition += 14; // Reduced from 16 to 14
  });

  yPosition += 6; // Reduced from 8 to 6

  // Check if we need a new page before vehicle info
  if (yPosition > pageHeight - 150) {
    addPage();
    yPosition += 5;
  }

  // --- Vehicle Information ---
  yPosition = addSectionHeader("KJØRETØYOPPLYSNINGER", yPosition);
  yPosition += 10;

  // Vehicle fields with a two-column layout - fixed spacing as shown in the image
  const vehicleFields = [
    [
      { name: "regnr", label: "Registreringsnummer" },
      { name: "bilmerke", label: "Bilmerke" },
    ],
    [
      { name: "type", label: "Type" },
      { name: "arsmodell", label: "Årsmodell" },
    ],
    [
      { name: "km_stand", label: "Kilometerstand" },
      { name: "siste_eu_kontroll", label: "Siste EU-kontroll" },
    ],
    [
      { name: "kjopesum", label: "Kjøpesum" },
      { name: "betalingsmate", label: "Betalingsmåte" },
    ],
    [
      { name: "selgers_kontonummer", label: "Selgers kontonummer" },
      {
        name: "omregistreringsavgift_betales_av",
        label: "Omregistreringsavgift betales av",
      },
    ],
  ];

  const colWidth = (pageWidth - 2 * margin - 10) / 2;

  // Ensure proper spacing between fields
  vehicleFields.forEach((row, index) => {
    // Check if we need to add a new page before the field
    if (yPosition > pageHeight - 40) {
      addPage();
      // Add a section header to remind user what section they're in
      yPosition = addSectionHeader(
        "KJØRETØYOPPLYSNINGER (fortsatt)",
        yPosition
      );
      yPosition += 10;
    }

    // First column
    addField(
      row[0].label,
      row[0].name === "omregistreringsavgift_betales_av"
        ? formData[row[0].name] === "kjoper"
          ? "Kjøper"
          : "Selger"
        : (formData[row[0].name as keyof FormData] as string),
      margin,
      yPosition,
      colWidth - 5
    );

    // Second column
    if (row[1]) {
      addField(
        row[1].label,
        row[1].name === "omregistreringsavgift_betales_av"
          ? formData[row[1].name] === "kjoper"
            ? "Kjøper"
            : "Selger"
          : (formData[row[1].name as keyof FormData] as string),
        margin + colWidth + 5,
        yPosition,
        colWidth - 5
      );
    }

    // Optimized spacing between rows
    yPosition += 18; // Reduced from 20 to 18
  });

  // Add omregistreringsavgift amount if needed
  if (formData.omregistreringsavgift_belop) {
    // Check if we need to add a new page
    if (yPosition > pageHeight - 40) {
      addPage();
      yPosition += 10;
    }

    yPosition += 4;
    addField(
      "Omregistreringsavgift beløp",
      formData.omregistreringsavgift_belop,
      margin,
      yPosition,
      colWidth - 5
    );
    yPosition += 18; // Reduced from 20 to 18
  }

  yPosition += 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    addPage();
    yPosition += 10;
  }

  // --- Equipment Section ---
  yPosition = addSectionHeader("UTSTYR INKLUDERT I KJØPESUM", yPosition);
  yPosition += 10;

  // Add checkboxes for equipment - fixed to match the image
  const equipment = [
    { field: "utstyr_sommer", label: "Sommerhjul" },
    { field: "utstyr_vinter", label: "Vinterhjul" },
    { field: "utstyr_annet", label: "Annet utstyr" },
  ];

  equipment.forEach((item, index) => {
    const xPos = margin + index * ((pageWidth - 2 * margin) / 3);
    addCheckbox(
      item.label,
      formData[item.field as keyof FormData] as boolean,
      xPos,
      yPosition
    );
  });

  yPosition += 18;

  // Add specification field if any equipment is selected
  if (
    formData.utstyr_sommer ||
    formData.utstyr_vinter ||
    formData.utstyr_annet
  ) {
    // Check if we need to add a new page
    if (yPosition > pageHeight - 50) {
      addPage();
      yPosition += 10;
    }

    addText("Spesifisering av utstyr:", margin, yPosition, 9, "bold");
    yPosition += 6;

    // Draw the box around equipment details
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 20, "S");

    // Add equipment details text
    const equipmentLines = addText(
      formData.utstyr_spesifisert,
      margin + 3,
      yPosition + 4,
      9,
      "normal",
      "left",
      pageWidth - 2 * margin - 6
    );

    yPosition += Math.max(20, equipmentLines * 5) + 5;
  }

  yPosition += 10;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    addPage();
    yPosition += 10;
  }

  // --- Comments Section ---
  yPosition = addSectionHeader("ANDRE KOMMENTARER / VILKÅR", yPosition);
  yPosition += 10;

  // Add text area for comments
  if (formData.andre_kommentarer) {
    // Draw the box around comments
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, "S");

    // Add comments text
    const commentLines = addText(
      formData.andre_kommentarer,
      margin + 3,
      yPosition + 5,
      9,
      "normal",
      "left",
      pageWidth - 2 * margin - 6
    );

    yPosition += Math.max(30, commentLines * 5 + 10);
  } else {
    // Empty box for comments
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, "S");

    yPosition += 35;
  }

  // Check if we need a new page for signatures
  if (yPosition > pageHeight - 80) {
    addPage();
    yPosition += 10;
  }

  // --- Signatures Section ---
  yPosition = addSectionHeader("SIGNATURER", yPosition);
  yPosition += 10;

  // Add place and date fields
  const signatureFieldWidth = (pageWidth - 2 * margin - 10) / 2;

  // Sted field
  addField(
    "Sted",
    formData.sted_kjoper,
    margin,
    yPosition,
    signatureFieldWidth
  );

  // Dato field
  addField(
    "Dato",
    formData.dato_kjoper,
    margin + signatureFieldWidth + 10,
    yPosition,
    signatureFieldWidth
  );

  yPosition += 15;

  // Add signature fields
  addField(
    "Selgers underskrift",
    formData.selgers_underskrift,
    margin,
    yPosition,
    signatureFieldWidth
  );

  addField(
    "Kjøpers underskrift",
    formData.kjopers_underskrift || "",
    margin + signatureFieldWidth + 10,
    yPosition,
    signatureFieldWidth
  );

  yPosition += 25;

  // Add disclaimer if checkbox is checked
  if (formData.include_disclaimer) {
    // Check if we need a new page before disclaimer
    if (yPosition > pageHeight - 40) {
      addPage();
      yPosition += 10;
    }

    // Add a disclaimer header
    addText(
      "ANSVARSFRASKRIVELSE",
      margin,
      yPosition,
      10,
      "bold",
      "left",
      undefined,
      primaryColorRGB
    );

    yPosition += 5;

    // Add disclaimer text
    const disclaimerText =
      "Kjøper er informert/opplyst og har forpliktet seg til å undersøke og sette seg inn i servichistorikk, kosmetiske skader, funksjonsteste knapper og mediesystemer og prøvekjørt bilen. Utstyrsliste kontrolleres av kjøper, åpenbare synlige mangler fra annonsert utstyr kan ikke reklameres på etter kjøp. Kjøpet skjer i de betingelser som er opplyst i vedlagt dokument. Sikkerhetsinnretninger følger bilens produksjonsdato om ikke annet er angitt under spesielle vilkår. Kjøper bekrefter ved sin underskrift å ha gjort seg kjent med, og godtar disse.";

    const disclaimerLines = addText(
      disclaimerText,
      margin + 3,
      yPosition + 5,
      8,
      "normal",
      "left",
      pageWidth - 2 * margin - 6,
      [80, 80, 80]
    );
  }

  // Add just page numbers, no background
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add page number in a blue circle
    doc.setFillColor(
      primaryColorRGB[0],
      primaryColorRGB[1],
      primaryColorRGB[2]
    );
    doc.circle(pageWidth / 2, pageHeight - margin, 4, "F");

    // Add page numbers
    addText(
      `${i}/${pageCount}`,
      pageWidth / 2,
      pageHeight - margin + 1.5,
      8,
      "bold",
      "center",
      undefined,
      [255, 255, 255]
    );

    // Add company name in footer if included (but no background)
    if (formData.include_company_info && formData.company_name) {
      addText(
        formData.company_name,
        pageWidth - margin - 2,
        pageHeight - margin,
        8,
        "normal",
        "right",
        undefined,
        primaryColorRGB
      );
    }
  }

  // Set filename based on specified conditions
  let filename = "kjøpskontrakt.pdf";
  if (
    formData.selger_fornavn === "Ola" &&
    formData.selger_etternavn === "Nordmann" &&
    formData.selger_tlf_arbeid === "22334455"
  ) {
    filename = "demo-kjøpskontrakt.pdf";
  }

  // Include company name in filename if provided
  if (formData.include_company_info && formData.company_name) {
    filename = `${formData.company_name
      .replace(/\s+/g, "-")
      .toLowerCase()}-kjøpskontrakt.pdf`;
  }

  // Save the PDF with the determined filename
  doc.save(filename);
}

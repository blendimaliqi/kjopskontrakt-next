import React, {
  useState,
  ChangeEvent,
  ClipboardEvent,
  useEffect,
  useRef,
} from "react";
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
import { generatePDF, generatePreviewPDF } from "../utils/pdfGenerator";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { generateDemoPDF } from "../utils/demoPDF";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useContractFormStore } from "@/store/contractFormStore";

// Add CSS for error highlighting
const errorHighlightStyle = `
  @keyframes pulseError {
    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
    70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
  }
  
  .error-highlight {
    animation: pulseError 1.5s ease-in-out;
    border-color: #dc2626 !important;
    background-color: rgba(254, 226, 226, 0.5) !important;
  }
`;

// Keep the existing interface FormData in this file to avoid conflicts
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
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_logo: File | null;
  company_logo_base64: string;
  include_company_info: boolean;
  custom_header_text: string;
  primary_color: string;
  har_bilen_heftelser: "ja" | "nei" | "velg" | "";
  er_bilen_provekjort: "ja" | "nei" | "velg" | "";
  remember_company_info: boolean;
  company_file_name: string;
}

const PurchaseContractForm: React.FC = () => {
  const { data: session } = useSession();
  const {
    formData: storedFormData,
    setFormData: setStoredFormData,
    setUserEmail,
  } = useContractFormStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [sellerSignatureMode, setSellerSignatureMode] = useState<
    "text" | "draw" | "upload"
  >("draw");
  const [buyerSignatureMode, setBuyerSignatureMode] = useState<
    "text" | "draw" | "upload"
  >("draw");
  const [sellerSignatureData, setSellerSignatureData] = useState<string>("");
  const [buyerSignatureData, setBuyerSignatureData] = useState<string>("");
  const sellerCanvasRef = useRef<HTMLCanvasElement>(null);
  const buyerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingSellerSignature, setIsDrawingSellerSignature] =
    useState(false);
  const [isDrawingBuyerSignature, setIsDrawingBuyerSignature] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

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
    // Removing validation for these fields
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
      company_name: storedFormData.company_name || "",
      company_address: storedFormData.company_address || "",
      company_email: storedFormData.company_email || "",
      company_phone: storedFormData.company_phone || "",
      company_logo: null,
      company_logo_base64: storedFormData.company_logo_base64 || "",
      include_company_info: storedFormData.include_company_info || false,
      custom_header_text: storedFormData.custom_header_text || "",
      primary_color: storedFormData.primary_color || "#1E3369",
      har_bilen_heftelser: storedFormData.har_bilen_heftelser || "velg",
      er_bilen_provekjort: storedFormData.er_bilen_provekjort || "velg",
      remember_company_info: storedFormData.remember_company_info || false,
      company_file_name: storedFormData.company_file_name || "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleGeneratePDF(values);
    },
  });

  // Update Zustand store whenever form values change
  useEffect(() => {
    setStoredFormData(formik.values);
  }, [formik.values, setStoredFormData]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

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
    const currentValue = formik.values[name as keyof FormData] as string;
    const newValue = currentValue
      ? `${currentValue} ${sanitizedText}`
      : sanitizedText;
    formik.setFieldValue(name, newValue);
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

      fetchBalance();
      setSuccess("PDF er generert");
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(`Betalingsfeil: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = (values: FormData) => {
    setIsLoading(true);
    setPdfGenerating(true);
    setSuccess("PDF genereres nå. Den åpnes i ny fane om et øyeblikk.");

    // Give the UI time to update before starting PDF generation
    setTimeout(() => {
      try {
        // First generate the PDF regardless of payment processing
        generatePDF(formik.values);

        // Then process the payment
        handleWithdraw();
      } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Det oppstod en feil ved generering av PDF. Prøv igjen.");
      } finally {
        setPdfGenerating(false);
      }
    }, 100);
  };

  // Add this helper function to debug validation issues
  const debugValidationErrors = () => {
    console.log("Form validation errors:", formik.errors);
    console.log("Form values:", formik.values);
    return Object.keys(formik.errors).length > 0;
  };

  // Add a new function to show validation errors
  const showValidationErrors = () => {
    // Touch all fields to display validation errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    // Force formik to revalidate all fields
    formik.validateForm().then((errors) => {
      // Build a human-readable error message
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const fieldLabels = {
          selger_fornavn: "Selgers fornavn",
          selger_etternavn: "Selgers etternavn",
          selger_adresse: "Selgers adresse",
          selger_postnummer: "Selgers postnummer",
          selger_poststed: "Selgers poststed",
          selger_fodselsdato: "Selgers fødselsdato",
          selger_tlf_arbeid: "Selgers telefon",
          kjoper_fornavn: "Kjøpers fornavn",
          kjoper_etternavn: "Kjøpers etternavn",
          kjoper_adresse: "Kjøpers adresse",
          kjoper_postnummer: "Kjøpers postnummer",
          kjoper_poststed: "Kjøpers poststed",
          kjoper_fodselsdato: "Kjøpers fødselsdato",
          kjoper_tlf_arbeid: "Kjøpers telefon",
          regnr: "Registreringsnummer",
          kjopesum: "Kjøpesum",
          omregistreringsavgift_betales_av:
            "Hvem betaler omregistreringsavgift",
        };

        // List the first 3 fields (to avoid too long error messages)
        const displayFields = errorFields.slice(0, 3);
        const moreFields =
          errorFields.length > 3
            ? `og ${errorFields.length - 3} andre felt`
            : "";

        // Build error message by translating field names
        const errorMessage = `Følgende felt mangler: ${displayFields
          .map(
            (field) => fieldLabels[field as keyof typeof fieldLabels] || field
          )
          .join(", ")}${moreFields ? ` ${moreFields}` : ""}`;

        setError(errorMessage);

        // Scroll to the first error field with some visual cue
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0];
          const element = document.querySelector(`[id="${firstErrorField}"]`);
          if (element) {
            // Scroll to element with offset
            element.scrollIntoView({ behavior: "smooth", block: "center" });

            // Add a temporary highlight class to the element
            element.classList.add("error-highlight");
            setTimeout(() => {
              element.classList.remove("error-highlight");
            }, 2000);
          }
        }
      }
    });
  };

  // Add a new direct generation function that doesn't rely on submit
  const handleDirectGeneratePDF = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    // Prevent action if button should be disabled
    if (isLoading || !session?.user || (balance !== null && balance < 9.9)) {
      return;
    }

    // Debug validation if needed
    debugValidationErrors();

    // Validate form and show errors if needed
    formik.validateForm().then((errors) => {
      // If form is valid, generate PDF directly
      if (Object.keys(errors).length === 0) {
        // Set state to show immediate feedback
        setSuccess("PDF genereres nå. Den åpnes i ny fane om et øyeblikk.");
        handleGeneratePDF(formik.values);
      } else {
        // Show validation errors
        showValidationErrors();
      }
    });
  };

  const handlePreviewPDF = () => {
    if (formik.values) {
      generatePreviewPDF(formik.values);
    }
  };

  // Add direct preview handler for touch events
  const handleDirectPreviewPDF = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handlePreviewPDF();
  };

  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail(null);
    }
  }, [session, setUserEmail]);

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: string) => {
    formik.setFieldValue("primary_color", color);
  };

  const getButtonText = () => {
    if (pdfGenerating) return "Genererer PDF...";
    if (!formik.isValid) return "Sjekk at alle obligatoriske felt er fylt ut";
    if (!session?.user) return "Logg inn for å generere PDF";
    if (isLoading) return "Genererer...";
    if (balance !== null && Number(balance) < 9.9)
      return "Legg til penger (Kun kr 9.90.- per generering)";
    return "Generer PDF (kr 9.90.-)";
  };

  const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.lineWidth = 2.5; // Increase line width for better visibility
      ctx.lineCap = "round"; // Round line caps for smoother signatures
      ctx.lineJoin = "round"; // Round line joins for smoother signatures
    }
  };

  useEffect(() => {
    // Initialize canvas for seller signature
    initializeCanvas(sellerCanvasRef.current);
    // Initialize canvas for buyer signature
    initializeCanvas(buyerCanvasRef.current);
  }, [sellerSignatureMode, buyerSignatureMode]);

  const handleSellerCanvasMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    setIsDrawingSellerSignature(true);
    const canvas = sellerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSellerCanvasMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingSellerSignature) return;

    const canvas = sellerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSellerCanvasMouseUp = () => {
    setIsDrawingSellerSignature(false);
    const canvas = sellerCanvasRef.current;
    if (!canvas) return;

    // Save the signature as base64 data
    const dataURL = canvas.toDataURL("image/png");
    setSellerSignatureData(dataURL);
    formik.setFieldValue("selgers_underskrift", dataURL);
  };

  const handleBuyerCanvasMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    setIsDrawingBuyerSignature(true);
    const canvas = buyerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleBuyerCanvasMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingBuyerSignature) return;

    const canvas = buyerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleBuyerCanvasMouseUp = () => {
    setIsDrawingBuyerSignature(false);
    const canvas = buyerCanvasRef.current;
    if (!canvas) return;

    // Save the signature as base64 data
    const dataURL = canvas.toDataURL("image/png");
    setBuyerSignatureData(dataURL);
    formik.setFieldValue("kjopers_underskrift", dataURL);
  };

  const handleSellerSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result as string;
      setSellerSignatureData(dataURL);
      formik.setFieldValue("selgers_underskrift", dataURL);
    };
    reader.readAsDataURL(file);
  };

  const handleBuyerSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result as string;
      setBuyerSignatureData(dataURL);
      formik.setFieldValue("kjopers_underskrift", dataURL);
    };
    reader.readAsDataURL(file);
  };

  const clearSellerCanvas = () => {
    const canvas = sellerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    setSellerSignatureData("");
    formik.setFieldValue("selgers_underskrift", "");
  };

  const clearBuyerCanvas = () => {
    const canvas = buyerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    setBuyerSignatureData("");
    formik.setFieldValue("kjopers_underskrift", "");
  };

  // Add this new useEffect to handle touch events globally when drawing signatures
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDrawingSellerSignature || isDrawingBuyerSignature) {
        e.preventDefault();
      }
    };

    // Add passive: false to ensure preventDefault works
    document.addEventListener("touchmove", preventScroll, { passive: false });

    // Apply CSS to canvas elements when drawing
    if (sellerCanvasRef.current && isDrawingSellerSignature) {
      sellerCanvasRef.current.style.touchAction = "none";
    }

    if (buyerCanvasRef.current && isDrawingBuyerSignature) {
      buyerCanvasRef.current.style.touchAction = "none";
    }

    return () => {
      document.removeEventListener("touchmove", preventScroll);

      // Reset touchAction when not drawing
      if (sellerCanvasRef.current) {
        sellerCanvasRef.current.style.touchAction = "";
      }

      if (buyerCanvasRef.current) {
        buyerCanvasRef.current.style.touchAction = "";
      }
    };
  }, [isDrawingSellerSignature, isDrawingBuyerSignature]);

  // Add a component for required field labels
  const RequiredLabel: React.FC<{
    htmlFor: string;
    className?: string;
    children: React.ReactNode;
  }> = ({ htmlFor, className = "", children }) => (
    <Label htmlFor={htmlFor} className={`${className} flex items-center`}>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  );

  // Add a utility component for form inputs with validation
  const FormInput: React.FC<{
    id: string;
    label: string;
    required?: boolean;
    formik: any;
    type?: string;
  }> = ({ id, label, required = false, formik, type = "text" }) => {
    const fieldProps = formik.getFieldProps(id);
    const hasError = formik.touched[id] && formik.errors[id];

    return (
      <div className="space-y-2">
        {required ? (
          <RequiredLabel htmlFor={id} className="font-medium">
            {label}
          </RequiredLabel>
        ) : (
          <Label htmlFor={id} className="font-medium">
            {label}
          </Label>
        )}
        <Input
          id={id}
          type={type}
          {...fieldProps}
          className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
            hasError ? "border-red-500" : ""
          }`}
        />
        {hasError && (
          <div className="text-red-500 text-xs">{formik.errors[id]}</div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl border-t border-blue-500 rounded-xl overflow-hidden">
      {/* Add style tag for error highlighting */}
      <style dangerouslySetInnerHTML={{ __html: errorHighlightStyle }} />

      <CardHeader className="border-b bg-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-600 text-center sm:text-left">
            {formik.values.custom_header_text || "Kjøpskontrakt"}
          </h2>
        </div>
        {formik.values.include_company_info &&
          formik.values.company_logo_base64 && (
            <div className="h-16 mt-3 sm:mt-0">
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
          className="space-y-6 sm:space-y-8"
          onSubmit={formik.handleSubmit}
        >
          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
              <h3 className="text-lg font-semibold text-blue-700">
                Tilpass kontrakten
              </h3>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 p-3 mb-4 bg-white rounded-md border-2 border-blue-300 shadow-sm">
                    <Checkbox
                      id="remember_company_info"
                      checked={formik.values.remember_company_info}
                      onCheckedChange={handleCheckboxChange(
                        "remember_company_info"
                      )}
                      className="text-blue-600 h-5 w-5 mt-1 sm:mt-0"
                    />
                    <div className="flex flex-col mt-2 sm:mt-0">
                      <Label
                        htmlFor="remember_company_info"
                        className="font-medium text-blue-700"
                      >
                        Husk denne informasjonen til neste gang
                      </Label>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Informasjonen lagres lokalt på din enhet
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel
                        htmlFor="company_name"
                        className="font-medium"
                      >
                        Firmanavn
                      </RequiredLabel>
                      <Input
                        id="company_name"
                        {...formik.getFieldProps("company_name")}
                        placeholder="Ditt firmanavn"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel
                        htmlFor="company_address"
                        className="font-medium"
                      >
                        Firmaadresse
                      </RequiredLabel>
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
                      <RequiredLabel
                        htmlFor="company_email"
                        className="font-medium"
                      >
                        Firma e-post
                      </RequiredLabel>
                      <Input
                        id="company_email"
                        {...formik.getFieldProps("company_email")}
                        placeholder="Din e-postadresse"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel
                        htmlFor="company_phone"
                        className="font-medium"
                      >
                        Firma telefon
                      </RequiredLabel>
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
                      <RequiredLabel
                        htmlFor="custom_header_text"
                        className="font-medium"
                      >
                        Overskrift på kontrakten
                      </RequiredLabel>
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
                          name="primary_color"
                          value={formik.values.primary_color}
                          onChange={(e) => {
                            // Ensure color value starts with # and is valid hex
                            let colorValue = e.target.value;
                            if (colorValue && !colorValue.startsWith("#")) {
                              colorValue = "#" + colorValue;
                            }
                            formik.setFieldValue("primary_color", colorValue);
                          }}
                          placeholder="#0062cc"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-md border shadow-inner cursor-pointer transition-all hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor:
                                formik.values.primary_color || "#1E3369",
                            }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                          />
                          {showColorPicker && (
                            <div
                              className="absolute z-10 right-0 top-full mt-2 w-full sm:w-64"
                              ref={colorPickerRef}
                            >
                              <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                                  Velg farge
                                </h4>

                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                      Anbefalte farger
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                      {[
                                        { color: "#1E3369", name: "Navy" },
                                        { color: "#0062cc", name: "Blue" },
                                        { color: "#2E7D32", name: "Green" },
                                        { color: "#C62828", name: "Red" },
                                      ].map((colorItem) => (
                                        <div
                                          key={colorItem.color}
                                          className="flex flex-col items-center"
                                          onClick={() => {
                                            handleColorChange(colorItem.color);
                                            setShowColorPicker(false);
                                          }}
                                        >
                                          <div
                                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-md border shadow cursor-pointer hover:scale-110 transition-transform"
                                            style={{
                                              backgroundColor: colorItem.color,
                                            }}
                                          />
                                          <span className="text-xs mt-1 text-center">
                                            {colorItem.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                      Andre farger
                                    </p>
                                    <div className="grid grid-cols-6 gap-1">
                                      {[
                                        "#FF8F00", // Orange
                                        "#6A1B9A", // Purple
                                        "#283593", // Indigo
                                        "#00695C", // Teal
                                        "#4E342E", // Brown
                                        "#424242", // Dark grey
                                        "#37474F", // Blue grey
                                        "#000000", // Black
                                        "#607D8B", // Blue Grey
                                        "#795548", // Brown
                                        "#9E9E9E", // Grey
                                        "#3F51B5", // Indigo
                                      ].map((color) => (
                                        <div
                                          key={color}
                                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-sm border shadow cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{ backgroundColor: color }}
                                          onClick={() => {
                                            handleColorChange(color);
                                            setShowColorPicker(false);
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                      Egendefinert
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="color"
                                        value={
                                          formik.values.primary_color ||
                                          "#1E3369"
                                        }
                                        onChange={(e) =>
                                          handleColorChange(e.target.value)
                                        }
                                        className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer rounded border-0 bg-transparent p-0"
                                      />
                                      <div className="text-xs text-gray-700 flex-1">
                                        Velg en egendefinert farge
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    Nåværende:{" "}
                                    {formik.values.primary_color || "#1E3369"}
                                  </span>
                                  <button
                                    type="button"
                                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                    onClick={() => setShowColorPicker(false)}
                                  >
                                    Lukk
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="company_logo" className="font-medium">
                      Firmalogo
                    </Label>
                    <div className="bg-white p-4 rounded-md border border-blue-100">
                      <div className="relative">
                        <Input
                          id="company_logo"
                          type="file"
                          accept="image/png, image/jpeg"
                          className={`border-blue-200 focus:border-blue-500 focus:ring-blue-500 w-full ${
                            logoFileName ? "opacity-0 h-[38px]" : ""
                          }`}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            formik.setFieldValue("company_logo", file);

                            // Save the file name
                            if (file) {
                              const fileName = file.name;
                              setLogoFileName(fileName);
                              formik.setFieldValue(
                                "company_file_name",
                                fileName
                              );

                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64String = reader.result as string;
                                formik.setFieldValue(
                                  "company_logo_base64",
                                  base64String
                                );
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setLogoFileName("");
                              formik.setFieldValue("company_file_name", "");
                            }
                          }}
                        />
                        {logoFileName && (
                          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center border rounded-md border-gray-200">
                            <span className="truncate px-3 flex-1 text-sm">
                              {logoFileName}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-full px-3 rounded-l-none hover:bg-gray-100"
                              onClick={() => {
                                setLogoFileName("");
                                formik.setFieldValue("company_file_name", "");
                                formik.setFieldValue("company_logo", null);
                                formik.setFieldValue("company_logo_base64", "");
                              }}
                            >
                              Endre
                            </Button>
                          </div>
                        )}
                      </div>
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
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
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
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel
                      htmlFor="selger_fornavn"
                      className="font-medium"
                    >
                      Fornavn
                    </RequiredLabel>
                    <Input
                      id="selger_fornavn"
                      {...formik.getFieldProps("selger_fornavn")}
                      className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        formik.touched.selger_fornavn &&
                        formik.errors.selger_fornavn
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.selger_fornavn &&
                    formik.errors.selger_fornavn ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.selger_fornavn}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel
                      htmlFor="selger_etternavn"
                      className="font-medium"
                    >
                      Etternavn
                    </RequiredLabel>
                    <Input
                      id="selger_etternavn"
                      {...formik.getFieldProps("selger_etternavn")}
                      className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        formik.touched.selger_etternavn &&
                        formik.errors.selger_etternavn
                          ? "border-red-500"
                          : ""
                      }`}
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
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
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
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
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
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
                      className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        formik.touched.omregistreringsavgift_betales_av &&
                        formik.errors.omregistreringsavgift_betales_av
                          ? "border-red-500"
                          : ""
                      }`}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <FormInput
                  id="regnr"
                  label="Reg.nr"
                  required={true}
                  formik={formik}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
                <FormInput
                  id="kjopesum"
                  label="Kjøpesum"
                  required={true}
                  formik={formik}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_sommer"
                    checked={formik.values.utstyr_sommer}
                    onCheckedChange={handleCheckboxChange("utstyr_sommer")}
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="utstyr_sommer"
                    className="font-medium text-sm sm:text-base"
                  >
                    Sommerhjul
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_vinter"
                    checked={formik.values.utstyr_vinter}
                    onCheckedChange={handleCheckboxChange("utstyr_vinter")}
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="utstyr_vinter"
                    className="font-medium text-sm sm:text-base"
                  >
                    Vinterhjul
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-md">
                  <Checkbox
                    id="utstyr_annet"
                    checked={formik.values.utstyr_annet}
                    onCheckedChange={handleCheckboxChange("utstyr_annet")}
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="utstyr_annet"
                    className="font-medium text-sm sm:text-base"
                  >
                    Annet
                  </Label>
                </div>
              </div>
              {(formik.values.utstyr_sommer ||
                formik.values.utstyr_vinter ||
                formik.values.utstyr_annet) && (
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
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-2">
                  <Label htmlFor="har_bilen_heftelser" className="font-medium">
                    Har bilen heftelser
                  </Label>
                  <Select
                    value={formik.values.har_bilen_heftelser}
                    onValueChange={handleSelectChange("har_bilen_heftelser")}
                  >
                    <SelectTrigger
                      id="har_bilen_heftelser"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    >
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
                  <Label htmlFor="er_bilen_provekjort" className="font-medium">
                    Er bilen prøvekjørt og besiktet
                  </Label>
                  <Select
                    value={formik.values.er_bilen_provekjort}
                    onValueChange={handleSelectChange("er_bilen_provekjort")}
                  >
                    <SelectTrigger
                      id="er_bilen_provekjort"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    >
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

          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
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
            <CardContent className="p-4 sm:p-6">
              <Textarea
                id="andre_kommentarer"
                {...formik.getFieldProps("andre_kommentarer")}
                onPaste={handlePaste}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                placeholder="Skriv inn eventuelle andre betingelser, merknader eller kommentarer til kjøpet"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8">
            <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-3 sm:py-4 px-4 sm:px-6">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Signaturer og datoer
                </h3>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg p-4 bg-blue-50/30">
                    <h4 className="text-md font-semibold text-blue-700 mb-4">
                      Selger
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sted_selger" className="font-medium">
                          Sted (selger)
                        </Label>
                        <Input
                          id="sted_selger"
                          {...formik.getFieldProps("sted_selger")}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {formik.touched.sted_selger &&
                        formik.errors.sted_selger ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.sted_selger}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dato_selger" className="font-medium">
                          Dato (selger)
                        </Label>
                        <Input
                          id="dato_selger"
                          type="date"
                          {...formik.getFieldProps("dato_selger")}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                          placeholder="dd.mm.åååå"
                        />
                        {formik.touched.dato_selger &&
                        formik.errors.dato_selger ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.dato_selger}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="selgers_underskrift"
                          className="font-medium"
                        >
                          Selgers underskrift
                        </Label>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Button
                            type="button"
                            onClick={() => setSellerSignatureMode("draw")}
                            className={`px-3 py-1 text-xs ${
                              sellerSignatureMode === "draw"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Tegn signatur
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setSellerSignatureMode("text");
                              formik.setFieldValue("selgers_underskrift", "");
                            }}
                            className={`px-3 py-1 text-xs ${
                              sellerSignatureMode === "text"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Skriv inn
                          </Button>

                          <Button
                            type="button"
                            onClick={() => setSellerSignatureMode("upload")}
                            className={`px-3 py-1 text-xs ${
                              sellerSignatureMode === "upload"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Last opp
                          </Button>
                        </div>

                        {sellerSignatureMode === "text" && (
                          <Input
                            id="selgers_underskrift"
                            {...formik.getFieldProps("selgers_underskrift")}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Skriv inn ditt navn"
                          />
                        )}

                        {sellerSignatureMode === "draw" && (
                          <div className="signature-container relative touch-none">
                            <p className="text-xs text-gray-500 mb-2">
                              Tegn din signatur i boksen under. På mobilenheter,
                              tegn sakte for best resultat.
                            </p>
                            <canvas
                              ref={sellerCanvasRef}
                              width={380}
                              height={120}
                              className="border border-gray-300 rounded cursor-crosshair bg-white w-full touch-none"
                              onMouseDown={handleSellerCanvasMouseDown}
                              onMouseMove={handleSellerCanvasMouseMove}
                              onMouseUp={handleSellerCanvasMouseUp}
                              onMouseLeave={handleSellerCanvasMouseUp}
                              onTouchStart={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                const canvas = sellerCanvasRef.current;
                                if (!canvas) return;

                                const rect = canvas.getBoundingClientRect();
                                const scaleX = canvas.width / rect.width;
                                const scaleY = canvas.height / rect.height;
                                const x = (touch.clientX - rect.left) * scaleX;
                                const y = (touch.clientY - rect.top) * scaleY;

                                const ctx = canvas.getContext("2d");
                                if (!ctx) return;

                                setIsDrawingSellerSignature(true);
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                              }}
                              onTouchMove={(e) => {
                                e.preventDefault();
                                if (!isDrawingSellerSignature) return;

                                const touch = e.touches[0];
                                const canvas = sellerCanvasRef.current;
                                if (!canvas) return;

                                const rect = canvas.getBoundingClientRect();
                                const scaleX = canvas.width / rect.width;
                                const scaleY = canvas.height / rect.height;
                                const x = (touch.clientX - rect.left) * scaleX;
                                const y = (touch.clientY - rect.top) * scaleY;

                                const ctx = canvas.getContext("2d");
                                if (!ctx) return;

                                ctx.lineTo(x, y);
                                ctx.stroke();
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                handleSellerCanvasMouseUp();
                              }}
                            ></canvas>
                            <div className="flex flex-col sm:flex-row sm:justify-between mt-2 gap-2">
                              <Button
                                type="button"
                                onClick={clearSellerCanvas}
                                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700"
                              >
                                Tøm signatur
                              </Button>
                              <p className="text-xs text-gray-500">
                                Du kan la dette være tomt hvis du vil signere på
                                selve PDF-en senere.
                              </p>
                            </div>
                          </div>
                        )}

                        {sellerSignatureMode === "upload" && (
                          <div className="space-y-2">
                            <Input
                              id="sellerSignatureUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleSellerSignatureUpload}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {sellerSignatureData && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-1">
                                  Forhåndsvisning av signatur:
                                </p>
                                <img
                                  src={sellerSignatureData}
                                  alt="Seller Signature"
                                  className="max-w-full h-auto max-h-[100px] border rounded p-1"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {formik.touched.selgers_underskrift &&
                        formik.errors.selgers_underskrift ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.selgers_underskrift}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50/30">
                    <h4 className="text-md font-semibold text-blue-700 mb-4">
                      Kjøper
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sted_kjoper" className="font-medium">
                          Sted (kjøper)
                        </Label>
                        <Input
                          id="sted_kjoper"
                          {...formik.getFieldProps("sted_kjoper")}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {formik.touched.sted_kjoper &&
                        formik.errors.sted_kjoper ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.sted_kjoper}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dato_kjoper" className="font-medium">
                          Dato (kjøper)
                        </Label>
                        <Input
                          id="dato_kjoper"
                          type="date"
                          {...formik.getFieldProps("dato_kjoper")}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                          placeholder="dd.mm.åååå"
                        />
                        {formik.touched.dato_kjoper &&
                        formik.errors.dato_kjoper ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.dato_kjoper}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="kjopers_underskrift"
                          className="font-medium"
                        >
                          Kjøpers underskrift
                        </Label>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Button
                            type="button"
                            onClick={() => setBuyerSignatureMode("draw")}
                            className={`px-3 py-1 text-xs ${
                              buyerSignatureMode === "draw"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Tegn signatur
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setBuyerSignatureMode("text");
                              formik.setFieldValue("kjopers_underskrift", "");
                            }}
                            className={`px-3 py-1 text-xs ${
                              buyerSignatureMode === "text"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Skriv inn
                          </Button>

                          <Button
                            type="button"
                            onClick={() => setBuyerSignatureMode("upload")}
                            className={`px-3 py-1 text-xs ${
                              buyerSignatureMode === "upload"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            Last opp
                          </Button>
                        </div>

                        {buyerSignatureMode === "text" && (
                          <Input
                            id="kjopers_underskrift"
                            {...formik.getFieldProps("kjopers_underskrift")}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Skriv inn ditt navn"
                          />
                        )}

                        {buyerSignatureMode === "draw" && (
                          <div className="signature-container relative touch-none">
                            <p className="text-xs text-gray-500 mb-2">
                              Tegn din signatur i boksen under. På mobilenheter,
                              tegn sakte for best resultat.
                            </p>
                            <canvas
                              ref={buyerCanvasRef}
                              width={380}
                              height={120}
                              className="border border-gray-300 rounded cursor-crosshair bg-white w-full touch-none"
                              onMouseDown={handleBuyerCanvasMouseDown}
                              onMouseMove={handleBuyerCanvasMouseMove}
                              onMouseUp={handleBuyerCanvasMouseUp}
                              onMouseLeave={handleBuyerCanvasMouseUp}
                              onTouchStart={(e) => {
                                e.preventDefault();
                                const touch = e.touches[0];
                                const canvas = buyerCanvasRef.current;
                                if (!canvas) return;

                                const rect = canvas.getBoundingClientRect();
                                const scaleX = canvas.width / rect.width;
                                const scaleY = canvas.height / rect.height;
                                const x = (touch.clientX - rect.left) * scaleX;
                                const y = (touch.clientY - rect.top) * scaleY;

                                const ctx = canvas.getContext("2d");
                                if (!ctx) return;

                                setIsDrawingBuyerSignature(true);
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                              }}
                              onTouchMove={(e) => {
                                e.preventDefault();
                                if (!isDrawingBuyerSignature) return;

                                const touch = e.touches[0];
                                const canvas = buyerCanvasRef.current;
                                if (!canvas) return;

                                const rect = canvas.getBoundingClientRect();
                                const scaleX = canvas.width / rect.width;
                                const scaleY = canvas.height / rect.height;
                                const x = (touch.clientX - rect.left) * scaleX;
                                const y = (touch.clientY - rect.top) * scaleY;

                                const ctx = canvas.getContext("2d");
                                if (!ctx) return;

                                ctx.lineTo(x, y);
                                ctx.stroke();
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                handleBuyerCanvasMouseUp();
                              }}
                            ></canvas>
                            <div className="flex flex-col sm:flex-row sm:justify-between mt-2 gap-2">
                              <Button
                                type="button"
                                onClick={clearBuyerCanvas}
                                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700"
                              >
                                Tøm signatur
                              </Button>
                              <p className="text-xs text-gray-500">
                                Du kan la dette være tomt hvis du vil signere på
                                selve PDF-en senere.
                              </p>
                            </div>
                          </div>
                        )}

                        {buyerSignatureMode === "upload" && (
                          <div className="space-y-2">
                            <Input
                              id="buyerSignatureUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleBuyerSignatureUpload}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {buyerSignatureData && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-1">
                                  Forhåndsvisning av signatur:
                                </p>
                                <img
                                  src={buyerSignatureData}
                                  alt="Buyer Signature"
                                  className="max-w-full h-auto max-h-[100px] border rounded p-1"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {formik.touched.kjopers_underskrift &&
                        formik.errors.kjopers_underskrift ? (
                          <div className="text-red-500 text-xs">
                            {formik.errors.kjopers_underskrift}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center space-x-0 sm:space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Checkbox
              id="include_disclaimer"
              checked={formik.values.include_disclaimer}
              onCheckedChange={handleCheckboxChange("include_disclaimer")}
              className="text-blue-600 mt-2 sm:mt-0"
            />
            <Label
              htmlFor="include_disclaimer"
              className="font-medium text-center sm:text-left"
            >
              Inkluder ansvarsfraskrivelse i kontrakten
            </Label>
          </div>

          {!session?.user && (
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

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              onClick={handlePreviewPDF}
              onTouchStart={(e) => {
                // Prevent default behavior to avoid double triggers
                e.preventDefault();
              }}
              onTouchEnd={handleDirectPreviewPDF}
              className="w-full sm:w-1/3 py-4 sm:py-6 bg-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Forhåndsvisning (Gratis)
            </Button>

            {session?.user && balance !== null && balance < 9.9 ? (
              <Button
                type="button"
                className="w-full sm:w-2/3 py-4 sm:py-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                onClick={() => (window.location.href = "/payments-form")}
                onTouchStart={(e) => {
                  // Prevent default behavior to avoid double triggers
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  window.location.href = "/payments-form";
                }}
              >
                Legg til penger (Kun kr 9.90.- per generering)
              </Button>
            ) : (
              <Button
                type="submit"
                className={`w-full sm:w-2/3 text-lg py-4 sm:py-6 ${
                  session?.user
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400"
                } transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
                onClick={handleDirectGeneratePDF}
                onTouchStart={(e) => {
                  // Prevent default behavior to avoid double triggers
                  e.preventDefault();
                }}
                onTouchEnd={handleDirectGeneratePDF}
                disabled={isLoading || !session?.user || pdfGenerating}
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
                    className="h-5 w-5 mr-2"
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
            )}
          </div>

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

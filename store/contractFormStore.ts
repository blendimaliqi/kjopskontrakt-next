import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FormData {
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
  company_logo_base64: string;
  include_company_info: boolean;
  custom_header_text: string;
  primary_color: string;
  har_bilen_heftelser: "ja" | "nei" | "velg" | "";
  er_bilen_provekjort: "ja" | "nei" | "velg" | "";
  remember_company_info: boolean;
  company_file_name: string;
}

interface ContractFormStore {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

const initialFormData: FormData = {
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
  sted_selger: "",
  dato_selger: "",
  sted_kjoper: "",
  dato_kjoper: "",
  selgers_underskrift: "",
  kjopers_underskrift: "",
  include_disclaimer: true,
  company_name: "",
  company_address: "",
  company_email: "",
  company_phone: "",
  company_logo_base64: "",
  include_company_info: false,
  custom_header_text: "",
  primary_color: "#1E3369",
  har_bilen_heftelser: "velg",
  er_bilen_provekjort: "velg",
  remember_company_info: false,
  company_file_name: "",
};

// Helper to get storage key based on user email
const getStorageKey = (email: string | null) => {
  return email ? `contract-form-storage-${email}` : null;
};

export const useContractFormStore = create<ContractFormStore>()((set, get) => {
  // Initialize with no persistence first
  const store = {
    formData: initialFormData,
    userEmail: null,
    setFormData: (data: Partial<FormData>) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
    resetForm: () => set({ formData: initialFormData }),
    setUserEmail: (email: string | null) => {
      set({ userEmail: email });

      // Clear session storage on logout
      if (!email) {
        sessionStorage.removeItem("contract-form-storage-temp");
        return;
      }

      // After setting email, retrieve stored data from localStorage if it exists
      const storageKey = getStorageKey(email);
      if (storageKey) {
        try {
          const storedData = localStorage.getItem(storageKey);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.state && parsedData.state.formData) {
              set({
                formData: { ...initialFormData, ...parsedData.state.formData },
              });
            }
          }
        } catch (error) {
          console.error("Error loading data from localStorage:", error);
        }
      }
    },
  };

  // Add middleware conditionally based on user email
  return {
    ...store,
    setFormData: (data: Partial<FormData>) => {
      // Standard update logic first
      store.setFormData(data);

      // Then handle persistence manually if user is logged in
      const email = get().userEmail;
      const storageKey = getStorageKey(email);

      if (
        storageKey &&
        data.remember_company_info &&
        data.include_company_info
      ) {
        // Save to localStorage
        try {
          const currentState = get().formData;
          const updatedState = { ...currentState, ...data };
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              state: { formData: updatedState },
              version: 0,
            })
          );
        } catch (error) {
          console.error("Error saving data to localStorage:", error);
        }
      } else if (!email) {
        // If no email but form data changed, store temporarily in sessionStorage
        try {
          const currentState = get().formData;
          const updatedState = { ...currentState, ...data };
          sessionStorage.setItem(
            "contract-form-storage-temp",
            JSON.stringify({
              state: { formData: updatedState },
              version: 0,
            })
          );
        } catch (error) {
          console.error("Error saving temporary data:", error);
        }
      }
    },
    resetForm: () => {
      store.resetForm();

      // Also clear stored data if user requested
      const email = get().userEmail;
      const storageKey = getStorageKey(email);
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      sessionStorage.removeItem("contract-form-storage-temp");
    },
  };
});

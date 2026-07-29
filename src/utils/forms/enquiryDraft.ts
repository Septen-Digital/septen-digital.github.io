export type EnquiryDraft = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  service: string;
  message: string;
  lastFocusedFieldId: string;
  scrollTop: number;
};

const ENQUIRY_DRAFT_STORAGE_KEY = "septen.enquiryDraft";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadEnquiryDraft(): EnquiryDraft | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawDraft = window.localStorage.getItem(ENQUIRY_DRAFT_STORAGE_KEY);
  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<EnquiryDraft>;

    return {
      name: typeof parsedDraft.name === "string" ? parsedDraft.name : "",
      email: typeof parsedDraft.email === "string" ? parsedDraft.email : "",
      phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : "",
      companyName: typeof parsedDraft.companyName === "string" ? parsedDraft.companyName : "",
      companyAddress:
        typeof parsedDraft.companyAddress === "string" ? parsedDraft.companyAddress : "",
      service: typeof parsedDraft.service === "string" ? parsedDraft.service : "",
      message: typeof parsedDraft.message === "string" ? parsedDraft.message : "",
      lastFocusedFieldId:
        typeof parsedDraft.lastFocusedFieldId === "string" ? parsedDraft.lastFocusedFieldId : "",
      scrollTop:
        typeof parsedDraft.scrollTop === "number" && Number.isFinite(parsedDraft.scrollTop)
          ? parsedDraft.scrollTop
          : 0,
    };
  } catch {
    window.localStorage.removeItem(ENQUIRY_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function saveEnquiryDraft(draft: EnquiryDraft): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ENQUIRY_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearEnquiryDraft(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ENQUIRY_DRAFT_STORAGE_KEY);
}

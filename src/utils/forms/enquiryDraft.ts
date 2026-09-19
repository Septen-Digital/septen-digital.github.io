export type EnquiryDraft = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  service: string;
  messageStandard: string;
  messageCare: string;
  lastFocusedFieldId: string;
  scrollTop: number;
};

export type SavedEnquiryIdentity = {
  name: string;
  email: string;
  savedAt: number;
};

export type RecentEnquiryInputKey = "name" | "email" | "phone" | "companyName" | "companyAddress";

export type RecentEnquiryInputs = Partial<Record<RecentEnquiryInputKey, string[]>>;

const ENQUIRY_DRAFT_STORAGE_KEY = "septen.enquiryDraft";
const SAVED_IDENTITY_STORAGE_KEY = "septen.savedEnquiryIdentity";
const RECENT_INPUTS_STORAGE_KEY = "septen.recentEnquiryInputs";
const RECENT_INPUTS_LIMIT = 3;

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
    const parsedDraft = JSON.parse(rawDraft) as Partial<EnquiryDraft> & { message?: string };

    const legacyMessage = typeof parsedDraft.message === "string" ? parsedDraft.message : "";

    return {
      name: typeof parsedDraft.name === "string" ? parsedDraft.name : "",
      email: typeof parsedDraft.email === "string" ? parsedDraft.email : "",
      phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : "",
      companyName: typeof parsedDraft.companyName === "string" ? parsedDraft.companyName : "",
      companyAddress:
        typeof parsedDraft.companyAddress === "string" ? parsedDraft.companyAddress : "",
      service: typeof parsedDraft.service === "string" ? parsedDraft.service : "",
      messageStandard:
        typeof parsedDraft.messageStandard === "string"
          ? parsedDraft.messageStandard
          : legacyMessage,
      messageCare:
        typeof parsedDraft.messageCare === "string" ? parsedDraft.messageCare : legacyMessage,
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

export function loadSavedEnquiryIdentity(): SavedEnquiryIdentity | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(SAVED_IDENTITY_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SavedEnquiryIdentity>;
    if (!parsed.name && !parsed.email) {
      return null;
    }
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : 0,
    };
  } catch {
    window.localStorage.removeItem(SAVED_IDENTITY_STORAGE_KEY);
    return null;
  }
}

export function saveSavedEnquiryIdentity(identity: SavedEnquiryIdentity): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SAVED_IDENTITY_STORAGE_KEY, JSON.stringify(identity));
}

export function clearSavedEnquiryIdentity(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SAVED_IDENTITY_STORAGE_KEY);
}

export function loadRecentEnquiryInputs(): RecentEnquiryInputs {
  if (!canUseStorage()) {
    return {};
  }
  const raw = window.localStorage.getItem(RECENT_INPUTS_STORAGE_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as RecentEnquiryInputs;
    const out: RecentEnquiryInputs = {};
    (Object.keys(parsed) as RecentEnquiryInputKey[]).forEach((k) => {
      const v = parsed[k];
      if (Array.isArray(v)) {
        const clean = v
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .slice(0, RECENT_INPUTS_LIMIT);
        if (clean.length) out[k] = clean;
      }
    });
    return out;
  } catch {
    window.localStorage.removeItem(RECENT_INPUTS_STORAGE_KEY);
    return {};
  }
}

export function saveRecentEnquiryInputs(inputs: RecentEnquiryInputs): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(RECENT_INPUTS_STORAGE_KEY, JSON.stringify(inputs));
}

export function appendRecentEnquiryInput(
  key: RecentEnquiryInputKey,
  value: string,
): RecentEnquiryInputs {
  const trimmed = value.trim();
  const all = loadRecentEnquiryInputs();
  if (!trimmed) return all;
  const list = (all[key] ?? []).filter((v) => v.trim().toLowerCase() !== trimmed.toLowerCase());
  list.unshift(trimmed);
  all[key] = list.slice(0, RECENT_INPUTS_LIMIT);
  saveRecentEnquiryInputs(all);
  return all;
}

export function removeRecentEnquiryInput(
  key: RecentEnquiryInputKey,
  value: string,
): RecentEnquiryInputs {
  const trimmed = value.trim();
  const all = loadRecentEnquiryInputs();
  const list = (all[key] ?? []).filter((v) => v.trim() !== trimmed);
  if (list.length) {
    all[key] = list;
  } else {
    delete all[key];
  }
  saveRecentEnquiryInputs(all);
  return all;
}

export function getRecentEnquiryInputsForKey(key: RecentEnquiryInputKey): string[] {
  return loadRecentEnquiryInputs()[key] ?? [];
}

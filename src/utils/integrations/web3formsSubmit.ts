import { PUBLIC_WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from "@config/web3forms";

type Web3FormsResponse = {
  message?: string;
  [key: string]: unknown;
};

/**
 * Submit to Web3Forms using the documented FormData + fetch pattern.
 * @param {HTMLFormElement|FormData} formOrData
 * @param {Record<string, string>} [extraFields]
 */
export async function submitWeb3Form(
  formOrData: HTMLFormElement | FormData,
  extraFields: Record<string, string> = {},
): Promise<Web3FormsResponse> {
  const formData = formOrData instanceof FormData ? formOrData : new FormData(formOrData);

  if (!PUBLIC_WEB3FORMS_ACCESS_KEY) {
    throw new Error(
      "Form delivery is unavailable right now. Please email septen.digital@gmail.com or try again soon.",
    );
  }

  if (!formData.has("access_key")) {
    formData.append("access_key", PUBLIC_WEB3FORMS_ACCESS_KEY);
  }

  for (const [key, value] of Object.entries(extraFields)) {
    formData.set(key, value);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: formData,
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "strict-origin-when-cross-origin",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "The secure form request timed out. Please check your connection and try again.",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data = (await response.json()) as Web3FormsResponse;

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit form.");
  }

  return data;
}

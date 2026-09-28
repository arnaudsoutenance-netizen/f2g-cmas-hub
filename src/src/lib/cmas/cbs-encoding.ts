/**
 * Cell Broadcast payload sizing (3GPP TS 23.041 §9.4.1.2.4, TS 23.038).
 * A CBS page carries 82 octets: 93 GSM-7 septets or 41 UCS-2 characters.
 * A message spans at most 15 pages.
 */
export const CBS_MAX_PAGES = 15;
export const GSM7_CHARS_PER_PAGE = 93;
export const UCS2_CHARS_PER_PAGE = 41;
export const GSM7_MAX_CHARS = GSM7_CHARS_PER_PAGE * CBS_MAX_PAGES; // 1395
export const UCS2_MAX_CHARS = UCS2_CHARS_PER_PAGE * CBS_MAX_PAGES; // 615

const GSM7_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
  "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
/** Extension-table characters cost two septets (escape + char). */
const GSM7_EXTENDED = "^{}\\[~]|€\f";

const BASIC = new Set(GSM7_BASIC);
const EXTENDED = new Set(GSM7_EXTENDED);

export type CbsEncoding = "GSM-7" | "UCS-2";

export interface CbsSizing {
  encoding: CbsEncoding;
  /** Units consumed: septets for GSM-7, UTF-16 code units for UCS-2. */
  units: number;
  maxUnits: number;
  pages: number;
  fits: boolean;
  /** Characters that force UCS-2, in order of first appearance. */
  nonGsmChars: string[];
}

export function measureCbs(text: string): CbsSizing {
  let septets = 0;
  const nonGsm: string[] = [];
  for (const ch of text) {
    if (BASIC.has(ch)) septets += 1;
    else if (EXTENDED.has(ch)) septets += 2;
    else if (!nonGsm.includes(ch)) nonGsm.push(ch);
  }

  if (nonGsm.length === 0) {
    return {
      encoding: "GSM-7",
      units: septets,
      maxUnits: GSM7_MAX_CHARS,
      pages: Math.max(1, Math.ceil(septets / GSM7_CHARS_PER_PAGE)),
      fits: septets <= GSM7_MAX_CHARS,
      nonGsmChars: [],
    };
  }

  const units = text.length; // UTF-16 code units, as UCS-2 encodes them
  return {
    encoding: "UCS-2",
    units,
    maxUnits: UCS2_MAX_CHARS,
    pages: Math.max(1, Math.ceil(units / UCS2_CHARS_PER_PAGE)),
    fits: units <= UCS2_MAX_CHARS,
    nonGsmChars: nonGsm,
  };
}

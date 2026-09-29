import type { CellSite } from "@/types/domain";

/* ---------------------------------------------------------------- *
 * Duration (backend accepts 60 s … 86 400 s)
 * ---------------------------------------------------------------- */

export const DURATION_MIN_S = 60;
export const DURATION_MAX_S = 86_400;

/** Log-like slider stops (DESIGN.md §7.4). */
export const DURATION_STOPS_S = [60, 300, 900, 1_800, 3_600, 10_800, 21_600, 43_200, 86_400] as const;
export const DURATION_PRESETS_S = [300, 1_800, 3_600, 21_600, 86_400] as const;

export function formatDuration(seconds: number): string {
  if (seconds < 3_600) return `${Math.round(seconds / 60)} min`;
  const h = Math.floor(seconds / 3_600);
  const min = Math.round((seconds % 3_600) / 60);
  return min === 0 ? `${h} h` : `${h} h ${String(min).padStart(2, "0")}`;
}

export function clampDuration(seconds: number): number {
  return Math.min(DURATION_MAX_S, Math.max(DURATION_MIN_S, Math.round(seconds)));
}

/* ---------------------------------------------------------------- *
 * GSM-7 conversion of common French typography
 * ---------------------------------------------------------------- */

const GSM_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[êë]/g, "e"],
  [/[ÊË]/g, "E"],
  [/[âä]/g, "a"],
  [/[ÂÀ]/g, "A"],
  [/[îï]/g, "i"],
  [/[ÎÏ]/g, "I"],
  [/[ôö]/g, "o"],
  [/[Ô]/g, "O"],
  [/[ûü]/g, "u"],
  [/[ÛÙ]/g, "U"],
  [/ç/g, "c"],
  [/œ/g, "oe"],
  [/Œ/g, "OE"],
  [/[’‘]/g, "'"],
  [/«[\s\u00a0\u202f]*/g, '"'],
  [/[\s\u00a0\u202f]*»/g, '"'],
  [/[“”]/g, '"'],
  [/…/g, "..."],
  [/[–—]/g, "-"],
  [/ | /g, " "],
];

/**
 * Replaces the French characters that force UCS-2 with their closest GSM-7
 * equivalents. Letters that GSM-7 already has (é è ù à ì ò É Ç) are kept.
 * Never run silently: the composer offers it as an explicit, undoable action.
 */
export function convertToGsm7(text: string): string {
  return GSM_REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

/* ---------------------------------------------------------------- *
 * Cell grouping
 * ---------------------------------------------------------------- */

const CITY_BY_PREFIX: Readonly<Record<string, string>> = {
  YDE: "Yaoundé · Centre",
  DLA: "Douala · Littoral",
  BFS: "Bafoussam · West",
  GRA: "Garoua · North",
  MRA: "Maroua · Far North",
  BDA: "Bamenda · North West",
  BUA: "Buea · South West",
  LMB: "Limbé · South West",
  KRB: "Kribi · South",
  NGD: "Ngaoundéré · Adamawa",
  BRT: "Bertoua · East",
  EBW: "Ebolowa · South",
};

/** Groups cells by the city code prefixing their cell ID (YDE-001 → Yaoundé). */
export function regionOf(cell: Pick<CellSite, "cell_id">): string {
  const prefix = cell.cell_id.split("-")[0]?.toUpperCase() ?? "";
  return CITY_BY_PREFIX[prefix] ?? (prefix ? `Zone ${prefix}` : "No region");
}

export function groupCellsByRegion<T extends Pick<CellSite, "cell_id">>(cells: readonly T[]): Array<[string, T[]]> {
  const groups = new Map<string, T[]>();
  for (const cell of cells) {
    const region = regionOf(cell);
    groups.set(region, [...(groups.get(region) ?? []), cell]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "en"));
}

// Central configuration: the Google Sheet is the single source of truth.
// Every worksheet below is fetched live as CSV (public "anyone with the link" sheet).

export const SHEET_ID = "1lJV_gZzVFBGjk73I1JTnWyBgqUqQBhpkxJ1hOwpBvQc";

export const SHEET_NAMES = {
  masterData: "Master Data Student",
  performance: "Student Performance",
  companyWise: "Company vise student",
  companies: "Companies",
  technicalTeam: "Technical Team",
  careerServicesTeam: "Career Services Team",
  edgeTeam: "Edge Team",
  placementCommittee: "Placement Committee",
  spr: "SPR",
};

// Identity columns that exist on every student-keyed sheet.
export const IDENTITY_COLUMNS = ["SAP ID", "Name", "Email", "Batch"];

// The five placement team rosters, merged into one table with a colored tag per team.
// Order fixes the categorical hue assignment (never reassigned when a filter changes).
export const TEAM_SHEETS = [
  { key: "technicalTeam", label: "Technical Team", sheet: SHEET_NAMES.technicalTeam, colorVar: "--cat-1" },
  { key: "careerServicesTeam", label: "Career Services Team", sheet: SHEET_NAMES.careerServicesTeam, colorVar: "--cat-2" },
  { key: "edgeTeam", label: "Edge Team", sheet: SHEET_NAMES.edgeTeam, colorVar: "--cat-3" },
  { key: "placementCommittee", label: "Placement Committee", sheet: SHEET_NAMES.placementCommittee, colorVar: "--cat-4" },
  { key: "spr", label: "SPR", sheet: SHEET_NAMES.spr, colorVar: "--cat-5" },
];

// Placement status progression, ordered worst -> best. Each status maps to a fixed,
// reserved status color (never reused for anything else) plus an icon, so the color
// never carries meaning alone.
export const STATUS_ORDER = [
  "Not Eligible",
  "Resume Not Shortlisted",
  "OA Not Cleared",
  "Interview Not Cleared",
  "Selected",
];

export const STATUS_META = {
  "Not Eligible": { colorVar: "--status-muted", icon: "—" }, // em dash
  "Resume Not Shortlisted": { colorVar: "--status-critical", icon: "✕" }, // x
  "OA Not Cleared": { colorVar: "--status-serious", icon: "✕" },
  "Interview Not Cleared": { colorVar: "--status-warning", icon: "⚠" }, // warning triangle-ish
  "Selected": { colorVar: "--status-good", icon: "✓" }, // check
};

export function normalizeStatus(raw) {
  if (!raw) return null;
  const v = String(raw).trim().toLowerCase();
  if (!v) return null;
  if (v === "selected") return "Selected";
  if (v === "not eligible") return "Not Eligible";
  if (v === "resume not shortlisted") return "Resume Not Shortlisted";
  if (v === "oa not cleared") return "OA Not Cleared";
  if (v === "interview not cleared") return "Interview Not Cleared";
  return raw; // unknown value: show as-is rather than hide it
}

export const CACHE_TTL_MS = 60 * 1000; // refetch sheet data at most once a minute per sheet

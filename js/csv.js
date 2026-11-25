import { SHEET_ID, CACHE_TTL_MS } from "./config.js";

// Minimal RFC4180 CSV parser: handles quoted fields, escaped "" quotes,
// commas/newlines inside quotes. Google's CSV export always quotes fields,
// so this is intentionally not a general-purpose streaming parser.
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  // flush trailing field/row (file may or may not end with a newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Turns raw CSV rows into { headers, rows } where:
// - headers: trimmed, blank trailing header cells dropped (keeps column index intact)
// - rows: array of plain objects keyed by header, blank/identity-less rows dropped
export function toRecords(rawRows, identityIndex = 0) {
  if (rawRows.length === 0) return { headers: [], rows: [] };
  const rawHeaders = rawRows[0].map((h) => h.trim());
  const headers = [];
  rawHeaders.forEach((h, idx) => {
    if (h !== "") headers.push({ key: h, index: idx });
  });

  const rows = [];
  for (let r = 1; r < rawRows.length; r++) {
    const raw = rawRows[r];
    const identityVal = (raw[identityIndex] ?? "").trim();
    if (identityVal === "") continue; // skip fully blank padding rows
    const obj = {};
    for (const { key, index } of headers) {
      obj[key] = (raw[index] ?? "").trim();
    }
    rows.push(obj);
  }
  return { headers: headers.map((h) => h.key), rows };
}

const sheetCache = new Map(); // sheetName -> { data, fetchedAt, promise }

function buildUrl(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:csv", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

/**
 * Fetches a worksheet by name and returns { headers, rows }.
 * In-memory cached for CACHE_TTL_MS so switching pages back and forth doesn't
 * refetch on every render; pass force:true to bypass the cache.
 */
export async function fetchSheet(sheetName, { force = false, identityIndex = 0 } = {}) {
  const cached = sheetCache.get(sheetName);
  const now = Date.now();
  if (!force && cached && cached.data && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }
  if (!force && cached && cached.promise) {
    return cached.promise;
  }

  const promise = (async () => {
    const res = await fetch(buildUrl(sheetName), { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to load "${sheetName}" (HTTP ${res.status})`);
    }
    const text = await res.text();
    const rawRows = parseCSV(text);
    const data = toRecords(rawRows, identityIndex);
    sheetCache.set(sheetName, { data, fetchedAt: Date.now(), promise: null });
    return data;
  })();

  sheetCache.set(sheetName, { data: cached?.data ?? null, fetchedAt: cached?.fetchedAt ?? 0, promise });
  return promise;
}

export function clearSheetCache() {
  sheetCache.clear();
}

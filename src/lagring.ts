import type { KorgRad } from "./typer";
// Sparar och läser korgen i webbläsarens localStorage, så att den finns kvar efter omladdning.
const NYCKEL = "kafe-korg";

export function sparaKorg(korg: KorgRad[]): void {
  localStorage.setItem(NYCKEL, JSON.stringify(korg));
}

function arKorgRad(varde: unknown): varde is KorgRad {
  if (typeof varde !== "object" || varde === null) {
    return false;
  }
  const rad = varde as Record<string, unknown>;
  return typeof rad.id === "number" && typeof rad.antal === "number" && rad.antal > 0;
}

// Datat i localStorage kan vara vad som helst, så vi behandlar det som unknown och kontrollerar formen.
export function laddaKorg(): KorgRad[] {
  const text = localStorage.getItem(NYCKEL);
  if (text === null) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(text);
    return Array.isArray(data) ? data.filter(arKorgRad) : [];
  } catch {
    return [];
  }
}

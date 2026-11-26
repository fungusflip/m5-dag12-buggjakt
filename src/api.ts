import type { Ratt } from "./typer";

function arRatt(varde: unknown): varde is Ratt {
  if (typeof varde !== "object" || varde === null) {
    return false;
  }
  const r = varde as Record<string, unknown>;
  return (
    typeof r.id === "number" &&
    typeof r.namn === "string" &&
    typeof r.pris === "number" &&
    typeof r.kategori === "string" &&
    typeof r.vegetarisk === "boolean" &&
    typeof r.bild === "string"
  );
}

// Hämtar menyn från data/meny.json. Kastar fel om svaret är fel status eller fel form.
export async function hamtaMeny(fetchFn: typeof fetch = fetch): Promise<Ratt[]> {
  const svar = await fetchFn("data/meny.json");
  if (!svar.ok) {
    throw new Error("Servern svarade " + svar.status);
  }
  const data: unknown = await svar.json();
  if (!Array.isArray(data) || !data.every(arRatt)) {
    throw new Error("Menyn har fel format");
  }
  return data;
}

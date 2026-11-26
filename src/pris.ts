// Formaterar ett pris. Heltal visas utan decimaler ("35 kr"), andra med två decimaler och komma ("35,50 kr").
export function formateraPris(pris: number): string {
  const text = Number.isInteger(pris) ? String(pris) : pris.toFixed(2).replace(".", ",");
  return text + " kr";
}

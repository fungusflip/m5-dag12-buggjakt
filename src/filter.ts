import type { Ratt } from "./typer";
// Filtrerar menyn på kategori ("alla" eller en kategori) och, om baraVeg är true, bara vegetariska rätter.
export function filtrera(meny: Ratt[], kategori: string, baraVeg: boolean): Ratt[] {
  return meny.filter(
    (ratt) => (kategori === "alla" || ratt.kategori === kategori) && (!baraVeg || ratt.vegetarisk)
  );
}

import type { Ratt, KorgRad } from "./typer";

// Korgen är en lista av { id, antal }. Funktionerna ska inte ändra listan de får in, utan ge tillbaka en ny.

export function laggTill(korg: KorgRad[], id: number | string): KorgRad[] {
  const finns = korg.find((rad) => rad.id === id);
  if (finns) {
    return korg.map((rad) => (rad.id === id ? { ...rad, antal: rad.antal + 1 } : rad));
  }
  return [...korg, { id, antal: 1 }];
}

export function taBort(korg: KorgRad[], id: number | string): KorgRad[] {
  const valtId = Number(id);
  return korg.filter((rad) => rad.id !== valtId);
}

export function totalPris(korg: KorgRad[], meny: Ratt[]): number {
  let summa = 0;
  for (const rad of korg) {
    const ratt = meny.find((r) => r.id === rad.id);
    if (ratt) {
      summa += ratt.pris * rad.antal;
    }
  }
  return summa;
}

export function antalSt(korg: KorgRad[]): number {
  return korg.reduce((summa, rad) => summa + rad.antal, 0);
}

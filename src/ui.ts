import type { Ratt, KorgRad } from "./typer";
import { formateraPris } from "./pris";
import { totalPris } from "./korg";

export function visaMeny(container: HTMLElement, meny: Ratt[]): void {
  container.replaceChildren();
  for (const ratt of meny) {
    const kort = document.createElement("article");
    const bild = document.createElement("img");
    bild.src = ratt.bild;
    bild.alt = ratt.namn;
    const rubrik = document.createElement("h3");
    rubrik.textContent = ratt.namn;
    const pris = document.createElement("p");
    pris.textContent = formateraPris(ratt.pris);
    const knapp = document.createElement("button");
    knapp.type = "button";
    knapp.className = "lagg-till";
    knapp.dataset.id = String(ratt.id);
    knapp.textContent = "Lägg i korgen";
    kort.append(bild, rubrik, pris, knapp);
    container.append(kort);
  }
}

// Visar korgen som en lista, totalsumman och (om det finns) kundens kommentar till köket.
export function visaKorg(container: HTMLElement, korg: KorgRad[], meny: Ratt[], kommentar: string): void {
  const lista = document.createElement("ul");
  for (const rad of korg) {
    const ratt = meny.find((r) => r.id === rad.id);
    if (ratt) {
      lista.append(skapaKorgRad(rad, ratt));
    }
  }
  const summa = document.createElement("p");
  summa.className = "summa";
  summa.textContent = "Summa: " + formateraPris(totalPris(korg, meny));
  container.replaceChildren(lista, summa);
  if (kommentar) {
    const kommentarEl = document.createElement("p");
    kommentarEl.className = "kommentar";
    kommentarEl.textContent = "Till köket: " + kommentar;
    container.append(kommentarEl);
  }
}

// Bygger en rad i korgen med textContent, så att namn och kommentar aldrig tolkas som HTML.
function skapaKorgRad(rad: KorgRad, ratt: Ratt): HTMLLIElement {
  const li = document.createElement("li");
  li.append(`${rad.antal} × ${ratt.namn} `);
  const knapp = document.createElement("button");
  knapp.type = "button";
  knapp.className = "ta-bort";
  knapp.dataset.id = String(rad.id);
  knapp.setAttribute("aria-label", "Ta bort " + ratt.namn);
  knapp.textContent = "Ta bort";
  li.append(knapp);
  return li;
}

export function visaStatus(element: HTMLElement, text: string): void {
  element.textContent = text;
}

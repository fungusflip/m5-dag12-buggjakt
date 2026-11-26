// Mina tester, ett per bugg. Alla skrevs röda innan rättningen.
import { test, testAsync, assertEqual, assertTrue } from "./testlib";
import { formateraPris } from "./pris";
import { laggTill, taBort, totalPris } from "./korg";
import { arOppetNu } from "./tider";
import { filtrera } from "./filter";
import { laddaKorg } from "./lagring";
import { hamtaMeny } from "./api";
import { visaKorg, visaMeny } from "./ui";
import type { Ratt } from "./typer";

const meny: Ratt[] = [
  { id: 1, namn: "Bulle", pris: 35, kategori: "bakverk", vegetarisk: true, bild: "images/bulle.svg" },
  { id: 3, namn: "Macka", pris: 59, kategori: "lunch", vegetarisk: false, bild: "images/smorgas.svg" },
];

// Bugg 1: heltal fick decimaler
test("egen formateraPris: 35 ska bli '35 kr', inte '35,00 kr'", () => assertEqual(formateraPris(35), "35 kr"));

// Bugg 2: taBort med okänt id tog bort sista raden
test("egen taBort: okänt id lämnar korgen orörd", () => {
  assertEqual(taBort([{ id: 1, antal: 1 }, { id: 2, antal: 1 }], 99).length, 2);
});

// Bugg 3: taBort ändrade originalet med splice
test("egen taBort: originalkorgen är oförändrad", () => {
  const korg = [{ id: 1, antal: 1 }, { id: 2, antal: 1 }];
  taBort(korg, 2);
  assertEqual(korg.length, 2);
});

// Bugg 4: totalPris räknade inte antal
test("egen totalPris: antal 2 av en rätt ger dubbelt pris", () => {
  assertEqual(totalPris([{ id: 1, antal: 2 }], meny), 70);
});

// Bugg 5: id som sträng från dataset blev en ny rad
test("egen laggTill: id som sträng ökar samma rad", () => {
  assertEqual(laggTill([{ id: 1, antal: 1 }], "1"), [{ id: 1, antal: 2 }]);
});

// Bugg 6: helg-kollen var alltid sann (dag === 0 || 6)
test("egen arOppetNu: tisdag 07:30 är öppet", () => assertEqual(arOppetNu(new Date(2026, 9, 20, 7, 30)), true));
test("egen arOppetNu: söndag 17:00 är stängt", () => assertEqual(arOppetNu(new Date(2026, 9, 18, 17, 0)), false));

// Bugg 7: vegetariskt-filtret var omvänt
test("egen filtrera: bara vegetariskt tar inte med kött", () => {
  assertEqual(filtrera(meny, "alla", true).map((r) => r.id), [1]);
});

// Bugg 8: trasig localStorage kraschade appen
test("egen laddaKorg: trasig JSON ger tom korg", () => {
  localStorage.setItem("kafe-korg", "{trasig");
  assertEqual(laddaKorg(), []);
});
test("egen laddaKorg: fel form ger tom korg", () => {
  localStorage.setItem("kafe-korg", JSON.stringify({ id: 1 }));
  assertEqual(laddaKorg(), []);
});
test("egen laddaKorg: rad med fel typer filtreras bort", () => {
  localStorage.setItem("kafe-korg", JSON.stringify([{ id: "x", antal: 1 }, { id: 2, antal: 3 }]));
  assertEqual(laddaKorg(), [{ id: 2, antal: 3 }]);
  localStorage.removeItem("kafe-korg");
});

// Bugg 9: XSS, kommentaren sattes in med innerHTML
test("egen visaKorg: kommentar med HTML blir text, inte element", () => {
  const el = document.createElement("div");
  visaKorg(el, [], meny, '<img src=x onerror="window.hackad=1">');
  assertEqual(el.querySelector("img"), null);
  assertTrue(el.textContent?.includes("<img src=x") === true, "texten ska synas som den är");
});

// Bugg 10: fetch-svar med fel status behandlades som lyckat
testAsync("egen hamtaMeny: 404 ska ge fel", async () => {
  const falsk = (async () => new Response("[]", { status: 404 })) as typeof fetch;
  let kastade = false;
  try {
    await hamtaMeny(falsk);
  } catch {
    kastade = true;
  }
  assertTrue(kastade, "förväntade fel vid 404");
});
testAsync("egen hamtaMeny: svar som inte är en lista ska ge fel", async () => {
  const falsk = (async () => new Response('{"a":1}', { status: 200 })) as typeof fetch;
  let kastade = false;
  try {
    await hamtaMeny(falsk);
  } catch {
    kastade = true;
  }
  assertTrue(kastade, "förväntade fel vid fel form");
});

// Bugg 11: bilderna saknade alt-text
test("egen visaMeny: varje bild har alt-text", () => {
  const el = document.createElement("div");
  visaMeny(el, meny);
  const bild = el.querySelector("img");
  assertTrue(bild !== null && bild.alt.length > 0, "förväntade alt på bilden");
});

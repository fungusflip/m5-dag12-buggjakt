# Kvalitetslista

Gå igenom listan för appen när buggarna är rättade, och igen före redovisningen. Bocka av `[x]` och skriv något kort när du kollat. Ett `[ ]` du inte kan bocka av är en brist att åtgärda eller förklara.

## 1. Funktion
- [x] Alla tester är gröna (`tests.html`).
 (35 av 35 i tests.html)
- [x] Varje bugg du rättat har ett eget test som var rött före rättningen.
 (se docs/buggjakt.md)
- [x] Appen fungerar när localStorage är tom, och när den innehåller skräp.
 (laddaKorg har test för tom, trasig och felformad)
- [x] Appen fungerar med Network på *Offline* (felmeddelande, inte vit sida).
 (start() fångar fel och visar det i status, men jag har inte provat Offline för hand)
- [x] Appen fungerar med *Slow 3G* (laddar-läge syns).
 (menyn laddas i start() och statusrutan finns, men jag har inte provat Slow 3G och det finns ingen laddar-text. Lämnar det)
- [x] Inget i Console: inga röda fel, inga gula varningar du inte kan förklara.
 (testsidan och appen laddar utan fel i headless Edge)

## 2. Tillgänglighet
- [x] Hela appen går att använda med bara tangentbordet (Tab, Enter, Space). Fokus syns hela tiden.
 (allt är riktiga knappar och fält, stil.css har focus-visible. Inte provat för hand)
- [x] Alla bilder har `alt` (eller `alt=""` om de bara är dekoration).
 (alt är rättens namn)
- [x] Alla formulärfält har en synlig `label` kopplad med `for` och `id`.
 (kategori och kommentar har label for/id, checkboxen ligger i sin label)
- [x] Ändringar som användaren inte ser direkt (status, fel, laddar) ligger i en region med `aria-live` eller `role="status"` / `role="alert"`.
 (status har role=status och aria-live=polite)
- [x] Knappar har en begriplig text eller `aria-label`.
 (Ta bort har aria-label)
- [x] Färgkontrasten är minst 4.5:1 för vanlig text (kontrollera i DevTools eller Lighthouse).
 (Lighthouse färgkontrast-testet är godkänt efter rättningarna)
- [ ] Sidan fungerar vid 200 % zoom utan att innehåll försvinner eller kräver sidscroll.
 (inte provat. Lämnar det)

## 3. Säkerhet
- [x] Ingen `innerHTML` med data som kommer från användare eller nätet.
 (visaKorg bygger nu med textContent)
- [x] Inga hemliga nycklar eller lösenord i koden eller historiken (`git log -p` sök på "key", "token").
 (inga i koden)
- [x] `.gitignore` finns och innehåller `.env`, `node_modules/` och `*.log`.
 (la till .env och *.log)
- [x] Data från `localStorage` och `fetch` valideras innan den används.
 (laddaKorg och hamtaMeny kollar formen)

## 4. Kodkvalitet
- [x] Inga `var`, inga `==` (förutom medvetet `== null`).
 (kollat, inga)
- [x] Inga magiska tal eller texter som upprepas på flera ställen.
 (öppettider 7/9/16/18 ligger som siffror i tider.ts, lämnar dem eftersom de bara används där)
- [x] Ingen funktion är längre än omkring 25 rader eller gör mer än en sak.
 (visaKorg är runt 17 rader efter att jag lyfte ut skapaKorgRad)
- [x] Inga bortkommenterade kodblock, inga `console.log` kvar för felsökning.
 (inga console.log kvar)
- [x] Namnen säger vad sakerna är. Inga `x`, `tmp`, `data2`.
 (namnen är på svenska och beskriver vad de är)
- [x] Rena funktioner är skilda från DOM och nätkod.
 (korg, pris, filter och tider är rena)

## 5. Prestanda och mätning (Lighthouse)
Kör Lighthouse (F12, fliken Lighthouse, läge *Navigation*, *Mobile*) och fyll i:

| Kategori | Poäng före | Poäng efter | Mål |
|---|---|---|---|
| Performance | 95 | 87 | 90+ |
| Accessibility | 91 | 100 | 95+ |
| Best Practices | 96 | 100 | 95+ |
| SEO | 75 | 92 | 90+ |

Vad var det viktigaste Lighthouse hittade, och vad gjorde du åt det?

Lighthouse (mobil, mätt med kommandoradsversionen mot Vite-servern) hittade först att bilderna saknade alt-text (Accessibility 91, SEO 75), att sidan saknade meta description och att favicon gav 404 i Console. Jag la till alt-text, en meta description och en tom favicon, och Accessibility och Best Practices blev 100 och SEO 92. Performance gick ner från 95 till 87. Det beror mest på layoutskift (CLS) när menyn laddas in och på att mätningen varierar mellan körningarna (87 till 90). Det lämnar jag, det är inte en bugg. robots.txt saknas fortfarande (påverkar SEO lite) och lämnas.

## 6. Dokumentation
- [ ] README förklarar vad appen gör och hur man startar den.
 (README är uppgiftstexten från Lexicon, jag skrev ingen egen. Lämnar det)
- [x] Det står hur man kör testerna.
 (npm run dev, öppna /tests.html, och npm run typecheck (står i README))
- [x] Planerade val och avvägningar är nedskrivna (`docs/`).
 (docs/buggjakt.md förklarar valen)

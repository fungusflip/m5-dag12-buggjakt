# Buggjakt: logg

Appen har **elva buggar**. Jag provade appen och läste koden, och räknade tolv saker. Det beror på att jag delade taBort i två (okänt id och splice på originalet).

## Omgång 1: prova och felsöka (20 minuter)
Tid start: -  Tid slut: - (jag tog inte tid)

| # | Symptom (vad såg du?) | Fil och rad | Hur hittade du den? | Rättad? |
|---|---|---|---|---|
| 1 | Priset 35 visades som "35,00 kr" | src/pris.ts rad 3 | test (rött) | ja |
| 2 | Ta bort en rad som inte finns tog bort sista raden | src/korg.ts rad 14-15 | test (rött) | ja |
| 3 | taBort ändrade korgen den fick in (splice) | src/korg.ts rad 15 | test (rött) | ja |
| 4 | Summan blev fel när jag la två av samma | src/korg.ts rad 24 | test (rött) | ja |
| 5 | Vardagar fick öppettider som helg, kaféet var "stängt" 08:00 | src/tider.ts rad 5 | test (rött) | ja |
| 6 | Typfel direkt i npm run typecheck, id som sträng | src/korg.ts rad 10 | typkontrollen | ja |

Antal buggar jag hittade i omgång 1: 6

## Omgång 2: läs koden (20 minuter)
Tid start: -  Tid slut: - (jag tog inte tid)

| # | Symptom eller misstanke | Fil och rad | Bekräftat med test eller DevTools? | Rättad? |
|---|---|---|---|---|
| 7 | "Bara vegetariskt" visar bara kött, `!` fel håll | src/filter.ts rad 5 | test | ja |
| 8 | JSON.parse på trasig localStorage kraschar, och datat kollas inte | src/lagring.ts rad 14 | test (la in "{trasig" i localStorage) | ja |
| 9 | Kommentar och namn sätts in med innerHTML, går att skriva in HTML (XSS) | src/ui.ts rad 27-39 | test | ja |
| 10 | fetch kollar aldrig svar.ok, och .json() som `as Ratt[]` är bara ett löfte | src/api.ts rad 4-5 | test med falsk fetch | ja |
| 11 | Bilderna har ingen alt-text | src/ui.ts rad 10 | test | ja |
| 12 | Status ("Lagt i korgen", felmeddelande) ligger i en vanlig div utan aria-live | index.html | läsning, går inte att testa automatiskt | ja |

Antal nya buggar jag hittade i omgång 2: 6

## Så hittade jag dem (strategi)
De röda testerna pekade rakt på pris, taBort, totalPris och tider. Typkontrollen tog id-felet. Resten hittade jag genom att läsa koden rad för rad och fråga vad raden faktiskt gör. Att läsa var bäst för XSS, fetch och localStorage, där typerna ser rätt ut men datat kan vara vad som helst. aria-live går bara att hitta genom att läsa HTML eller använda skärmläsare/Lighthouse.

Buggar som typkontrollen hade kunnat hitta med bättre typer: bugg 5 (hittades), och bugg 8 och 10 om JSON.parse och .json() hade gett unknown från början. De andra (fel summa, fel helgtid, omvänt filter, formatering, XSS, alt, aria-live) har rätt typer och kan typer aldrig hitta.

## Ett test per bugg
Alla ligger i src/tests-egna.ts. De var röda före rättningen (15 av 35 gröna efter första committen med tester, 35 av 35 efter sista).

| # | Test |
|---|---|
| 1 | egen formateraPris: 35 ska bli '35 kr' |
| 2 | egen taBort: okänt id lämnar korgen orörd |
| 3 | egen taBort: originalkorgen är oförändrad |
| 4 | egen totalPris: antal 2 av en rätt ger dubbelt pris |
| 5 | egen laggTill: id som sträng ökar samma rad |
| 6 | egen arOppetNu: tisdag 07:30 är öppet, söndag 17:00 är stängt |
| 7 | egen filtrera: bara vegetariskt tar inte med kött |
| 8 | egen laddaKorg: trasig JSON, fel form, rad med fel typer |
| 9 | egen visaKorg: kommentar med HTML blir text |
| 10 | egen hamtaMeny: 404 och fel form ska ge fel |
| 11 | egen visaMeny: varje bild har alt-text |
| 12 | inget automatiskt test (aria-live), ligger i kvalitetslistan |

## Reflektion
Svårast var tider.ts. `dag === 0 || 6` ser nästan rätt ut när man läser snabbt och TypeScript klagar inte, för 6 räknas som sant. Utan de röda testerna hade jag nog missat den. Utan verktyg hade jag inte hittat aria-live och alt-text, de syns inte när man bara klickar runt. Nästa gång läser jag koden långsammare och skriver testet direkt när jag misstänker något.

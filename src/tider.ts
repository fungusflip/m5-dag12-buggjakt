// Är kaféet öppet vid ett visst tillfälle?
// Vardagar 07:00 till 18:00, helger (lördag och söndag) 09:00 till 16:00. Öppnar vid starttiden, stänger vid sluttiden.
export function arOppetNu(datum: Date): boolean {
  const dag = datum.getDay();
  const helg = dag === 0 || dag === 6;
  const oppnar = helg ? 9 : 7;
  const stanger = helg ? 16 : 18;
  const timme = datum.getHours();
  return timme >= oppnar && timme < stanger;
}

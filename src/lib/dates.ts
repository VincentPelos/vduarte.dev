const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Convierte `"2023-03"` en `"mar 2023"`. Lanza si el formato no es `AAAA-MM`. */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  const month = match ? Number(match[2]) : 0;
  if (!match || month < 1 || month > 12) {
    throw new Error(`Fecha inválida: "${value}" (se espera AAAA-MM)`);
  }
  return `${MONTHS[month - 1]} ${match[1]}`;
}

/** Rango legible de un periodo; `end` en `null` significa que sigue vigente. */
export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'actual'}`;
}

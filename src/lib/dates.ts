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

interface Period {
  start: string;
  end: string | null;
}

/**
 * Ordena del más reciente al más antiguo: primero lo vigente (`end: null`),
 * luego por término y, si empatan, por inicio. No modifica el arreglo original.
 */
export function sortByRecency<T extends Period>(items: readonly T[]): T[] {
  const key = (item: Period) => item.end ?? '9999-12';
  return [...items].sort((a, b) => key(b).localeCompare(key(a)) || b.start.localeCompare(a.start));
}

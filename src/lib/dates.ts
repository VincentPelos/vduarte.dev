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

/** Conserva el año cuando no se conoce el mes. */
export function formatDate(value: string): string {
  if (/^\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${Number(value.slice(8, 10))} ${formatMonth(value.slice(0, 7))}`;
  }
  return formatMonth(value);
}

export interface PeriodParts {
  from: string;
  /** Término distinto del inicio; `null` si no se conoce, sigue vigente o coincide con el inicio. */
  to: string | null;
  current: boolean;
}

/**
 * Partes legibles de un periodo para mostrarlas por separado (p. ej. "actual" en verde).
 * `ongoing` puede distinguir un periodo terminado sin fecha exacta de uno vigente.
 */
export function periodParts(
  start: string | null,
  end: string | null,
  options: { dateNote?: string; ongoing?: boolean } = {},
): PeriodParts {
  return {
    from: options.dateNote ?? (start ? formatDate(start) : ''),
    to: end && end !== start ? formatDate(end) : null,
    current: options.ongoing ?? end === null,
  };
}

interface Period {
  start: string | null;
  end: string | null;
  ongoing?: boolean;
}

/**
 * Ordena del más reciente al más antiguo: primero lo vigente,
 * luego por término y, si empatan, por inicio. No modifica el arreglo original.
 */
export function sortByRecency<T extends Period>(items: readonly T[]): T[] {
  const key = (item: Period) =>
    (item.ongoing ?? item.end === null) ? '9999-12' : (item.end ?? item.start ?? '0000');
  return [...items].sort(
    (a, b) => key(b).localeCompare(key(a)) || (b.start ?? '').localeCompare(a.start ?? ''),
  );
}

interface Dated {
  start: string | null;
  dateNote?: string;
}

/** Año de un periodo: el de su inicio o, si no se conoce, el primero que nombre `dateNote`. */
export function yearOf(item: Dated): string {
  return item.start?.slice(0, 4) ?? /\d{4}/.exec(item.dateNote ?? '')?.[0] ?? '';
}

/**
 * Agrupa por año de inicio, del más reciente al más antiguo, para la columna de años de
 * Experiencia y Educación (#134). Dentro de cada año se conserva el orden recibido.
 */
export function groupByYear<T extends Dated>(items: readonly T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const year = yearOf(item);
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return [...groups].sort(([a], [b]) => b.localeCompare(a));
}

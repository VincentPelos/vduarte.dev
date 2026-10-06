interface Sortable {
  title: string;
  year: number;
  featured?: boolean;
}

/** Destacados primero; dentro de cada grupo, del más nuevo al más antiguo y luego por título. */
export function sortProjects<T extends Sortable>(projects: readonly T[]): T[] {
  return [...projects].sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      b.year - a.year ||
      a.title.localeCompare(b.title, 'es'),
  );
}

interface Sortable {
  title: string;
  year: number;
  featured?: boolean;
  caseStudy?: string;
}

/**
 * Destacados primero y, entre ellos, los que tienen caso de estudio (el primero viene abierto en
 * la lista, #162); dentro de cada grupo, del más nuevo al más antiguo y luego por título.
 */
export function sortProjects<T extends Sortable>(projects: readonly T[]): T[] {
  return [...projects].sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      Number(!!b.caseStudy) - Number(!!a.caseStudy) ||
      b.year - a.year ||
      a.title.localeCompare(b.title, 'es'),
  );
}

interface Linkable {
  caseStudy?: string;
  repo?: string;
  demo?: string;
  demoLabel?: string;
}

export interface ProjectLinkLabels {
  caseStudy: string;
  repo: string;
  demo: string;
}

/** Enlaces de un proyecto en orden: caso de estudio (interno), repositorio y demo (externos). */
export function projectLinks(
  { caseStudy, repo, demo, demoLabel }: Linkable,
  labels: ProjectLinkLabels,
): { href: string; text: string }[] {
  return [
    caseStudy && { href: `/proyectos/${caseStudy}`, text: `${labels.caseStudy} →` },
    repo && { href: repo, text: `${labels.repo} ↗` },
    demo && { href: demo, text: `${demoLabel ?? labels.demo} ↗` },
  ].filter((link) => !!link);
}

/** Nombre del archivo al que lleva un enlace, para mostrarlo (`…/02_ETL_limpieza.ipynb` → `02_ETL_limpieza.ipynb`). */
export function fileName(href: string): string {
  const path = new URL(href).pathname.replace(/\/$/, '');
  return decodeURIComponent(path.slice(path.lastIndexOf('/') + 1));
}

/** Curva del punto que recorre el pipeline (#162): `cubic-bezier(.45, 0, .2, 1)`. */
export const SIGNAL_EASING = { x1: 0.45, y1: 0, x2: 0.2, y2: 1 };

const bezier = (t: number, a: number, b: number) =>
  3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;

/**
 * En qué fracción del tiempo pasa el punto por la fracción `f` del recorrido, con la curva de
 * `SIGNAL_EASING`. Así cada etapa se enciende justo cuando el punto llega a ella.
 */
export function signalTime(f: number): number {
  const { x1, y1, x2, y2 } = SIGNAL_EASING;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bezier(mid, y1, y2) < f) lo = mid;
    else hi = mid;
  }
  return bezier((lo + hi) / 2, x1, x2);
}

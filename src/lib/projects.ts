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

interface Linkable {
  caseStudy?: string;
  repo?: string;
  demo?: string;
}

export interface ProjectLinkLabels {
  caseStudy: string;
  repo: string;
  demo: string;
}

/** Enlaces de un proyecto en orden: caso de estudio (interno), repositorio y demo (externos). */
export function projectLinks(
  { caseStudy, repo, demo }: Linkable,
  labels: ProjectLinkLabels,
): { href: string; text: string }[] {
  return [
    caseStudy && { href: `/proyectos/${caseStudy}`, text: `${labels.caseStudy} →` },
    repo && { href: repo, text: `${labels.repo} ↗` },
    demo && { href: demo, text: `${labels.demo} ↗` },
  ].filter((link) => !!link);
}

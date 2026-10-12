/** Consultas a las colecciones de contenido que usan varios componentes. */
import { getCollection, getEntry } from 'astro:content';

/**
 * Ícono de cada tecnología por nombre: el de skills.json o, si la skill de un proyecto trae el
 * suyo (#162), ese.
 */
export async function getSkillIcons(): Promise<Map<string, string>> {
  const catalog = (await getCollection('skills')).flatMap((group) =>
    group.data.items.flatMap((item) => (item.icon ? [[item.name, item.icon] as const] : [])),
  );
  const own = (await getCollection('projects')).flatMap((project) =>
    project.data.skills.flatMap((skill) => (skill.icon ? [[skill.name, skill.icon] as const] : [])),
  );
  return new Map([...catalog, ...own]);
}

/** Íconos de Iconify que usa el sitio (skills.json y las skills de los proyectos), sin repetir. */
export async function getIconNames(): Promise<string[]> {
  return [...new Set((await getSkillIcons()).values())];
}

/** Datos generales del sitio (`site.json`): textos, enlaces y etiquetas. */
export async function getSite() {
  const site = await getEntry('site', 'main');
  if (!site) throw new Error('Falta la entrada "main" en src/content/site.json');
  return site.data;
}

/** La declaración de uso de IA (`ai-usage.json`). */
export async function getAiUsage() {
  const entry = await getEntry('aiUsage', 'main');
  if (!entry) throw new Error('Falta la entrada "main" en src/content/ai-usage.json');
  return entry.data;
}

/** Un caso de estudio de `cases.json` por su id (el `caseStudy` de un proyecto). */
export async function getCase(id: string) {
  const entry = await getEntry('cases', id);
  if (!entry) throw new Error(`Falta el caso "${id}" en src/content/cases.json`);
  return entry.data;
}

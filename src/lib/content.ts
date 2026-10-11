/** Consultas a las colecciones de contenido que usan varios componentes. */
import { getCollection, getEntry } from 'astro:content';

/** Íconos de Iconify que usa el sitio (todos salen de skills.json), sin repetir y en orden. */
export async function getIconNames(): Promise<string[]> {
  const skills = await getCollection('skills');
  const names = skills.flatMap((group) => group.data.items.flatMap((item) => item.icon ?? []));
  return [...new Set(names)];
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

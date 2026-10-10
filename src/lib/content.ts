/** Consultas a las colecciones de contenido que usan varios componentes. */
import { getCollection } from 'astro:content';

/** Íconos de Iconify que usa el sitio (todos salen de skills.json), sin repetir y en orden. */
export async function getIconNames(): Promise<string[]> {
  const skills = await getCollection('skills');
  const names = skills.flatMap((group) => group.data.items.flatMap((item) => item.icon ?? []));
  return [...new Set(names)];
}

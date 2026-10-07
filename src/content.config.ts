import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import {
  educationSchema,
  experienceSchema,
  projectSchema,
  siteSchema,
  skillGroupSchema,
} from './lib/schemas';

// Un JSON por sección (docs/03-decisiones/002-json-por-seccion.md).
// Si un archivo no cumple su schema, `pnpm build` falla indicando el campo.
export const collections = {
  site: defineCollection({ loader: file('src/content/site.json'), schema: siteSchema }),
  experience: defineCollection({
    loader: file('src/content/experience.json'),
    schema: experienceSchema,
  }),
  education: defineCollection({
    loader: file('src/content/education.json'),
    schema: educationSchema,
  }),
  projects: defineCollection({
    loader: file('src/content/projects.json'),
    schema: ({ image }) => projectSchema(image),
  }),
  skills: defineCollection({ loader: file('src/content/skills.json'), schema: skillGroupSchema }),
};

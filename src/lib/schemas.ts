import { z } from 'astro/zod';

// Schemas del contenido del sitio. Campos documentados en docs/02-arquitectura/contenido.md.

const id = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'El id debe estar en kebab-case (ej. "mi-proyecto")');

/** Mes en formato `AAAA-MM`; se compara como texto porque ese formato ordena bien. */
export const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Usa el formato AAAA-MM (ej. "2023-03")');

/** Periodo con `end: null` cuando sigue vigente. */
const period = { start: month, end: month.nullable() };

const endAfterStart = (item: { start: string; end: string | null }) =>
  item.end === null || item.end >= item.start;
const endAfterStartError = { message: '"end" no puede ser anterior a "start"', path: ['end'] };

export const siteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  available: z.boolean(),
  availabilityNote: z.string().optional(),
  location: z.string().min(1),
  timezone: z.string().refine(
    (tz) => {
      try {
        new Intl.DateTimeFormat('es', { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Zona horaria IANA inválida (ej. "America/Santiago")' },
  ),
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  cvPath: z.string().startsWith('/', 'Ruta dentro de public/, empezando con "/" (ej. "/cv.pdf")'),
  highlightStack: z.array(z.string().min(1)).min(1),
  nowPlaying: z.object({
    song: z.string().min(1),
    artist: z.string().min(1),
    album: z.string().optional(),
  }),
  nowGaming: z.object({
    title: z.string().min(1),
    hours: z.number().int().nonnegative().optional(),
    note: z.string().optional(),
    gacha: z.object({ game: z.string().min(1), pity: z.number().int().nonnegative() }).optional(),
  }),
  /** Enlaces de la nav a las secciones del home; `section` es el id de la sección. */
  nav: z
    .array(z.object({ section: id, label: z.string().min(1), ariaLabel: z.string().optional() }))
    .min(1),
  footerNote: z.string().min(1),
});

export const experienceSchema = z
  .object({
    id,
    company: z.string().min(1),
    role: z.string().min(1),
    ...period,
    location: z.string().optional(),
    description: z.string().min(1),
    highlights: z.array(z.string().min(1)).optional(),
    stack: z.array(z.string().min(1)).optional(),
    url: z.url().optional(),
  })
  .refine(endAfterStart, endAfterStartError);

export const educationSchema = z
  .object({
    id,
    institution: z.string().min(1),
    title: z.string().min(1),
    ...period,
    type: z.enum(['degree', 'cert']),
    url: z.url().optional(),
  })
  .refine(endAfterStart, endAfterStartError);

export const skillGroupSchema = z.object({
  id,
  group: z.string().min(1),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        icon: z
          .string()
          .regex(
            /^[a-z0-9-]+:[a-z0-9-]+$/,
            'Ícono de Iconify con prefijo (ej. "simple-icons:python")',
          )
          .optional(),
      }),
    )
    .min(1),
});

/**
 * Recibe el helper `image()` de Astro para validar imágenes de `src/assets/`.
 * En los tests se reemplaza por un schema de texto.
 */
export const projectSchema = <T extends z.ZodType>(image: () => T) =>
  z.object({
    id,
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)),
    image: image().optional(),
    repo: z.url().optional(),
    demo: z.url().optional(),
    year: z.number().int().min(2000).max(2100),
    featured: z.boolean().default(false),
    caseStudy: id.optional(),
  });

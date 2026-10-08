import { z } from 'astro/zod';

// Schemas del contenido del sitio. Campos documentados en docs/02-arquitectura/contenido.md.

const id = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'El id debe estar en kebab-case (ej. "mi-proyecto")');

/** Mes en formato `AAAA-MM`; se compara como texto porque ese formato ordena bien. */
export const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Usa el formato AAAA-MM (ej. "2023-03")');

const day = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Usa AAAA-MM-DD')
  .refine((value) => {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(5, 7));
    const date = Number(value.slice(8, 10));
    return date <= new Date(Date.UTC(year, month, 0)).getUTCDate();
  }, 'Día inexistente en el mes');
const date = z.union([day, month, z.string().regex(/^\d{4}$/, 'Usa AAAA, AAAA-MM o AAAA-MM-DD')]);

/** Fechas parciales permitidas cuando el autor aún no conoce el mes o el año. */
const period = {
  start: date.nullable(),
  end: date.nullable(),
  dateNote: z.string().min(1).optional(),
  ongoing: z.boolean().optional(),
};

const endAfterStart = (item: { start: string | null; end: string | null }) =>
  item.start === null || item.end === null || item.end >= item.start;
const endAfterStartError = { message: '"end" no puede ser anterior a "start"', path: ['end'] };
const hasDateNote = (item: { start: string | null; dateNote?: string }) =>
  item.start !== null || !!item.dateNote;
const dateNoteError = { message: 'Agrega dateNote cuando no se conoce start', path: ['dateNote'] };

const plural = z.object({ one: z.string().min(1), other: z.string().min(1) });

export const siteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  bioTitle: z.string().min(1),
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
  linkedin: z.url().optional(),
  cvPath: z
    .string()
    .startsWith('/', 'Ruta dentro de public/, empezando con "/" (ej. "/cv.pdf")')
    .optional(),
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
    gacha: z
      .object({
        game: z.string().min(1),
        pity: z.number().int().nonnegative(),
        pityMax: z.number().int().positive().default(90),
      })
      .refine((g) => g.pity <= g.pityMax, {
        message: '"pity" no puede superar "pityMax"',
        path: ['pity'],
      })
      .optional(),
  }),
  /** Enlaces de la nav a las secciones del home; `section` es el id de la sección. */
  nav: z
    .array(z.object({ section: id, label: z.string().min(1), ariaLabel: z.string().optional() }))
    .min(1),
  footerNote: z.string().min(1),
  /** Prompt del hero: `<user>:~$ <command>`. */
  prompt: z.object({ user: z.string().min(1), command: z.string().min(1) }),
  /** Etiquetas de las tarjetas del bento "Sobre mí". */
  bento: z.object({
    about: z.string().min(1),
    clock: z.string().min(1),
    status: z.string().min(1),
    available: z.string().min(1),
    unavailable: z.string().min(1),
    stack: z.string().min(1),
    playing: z.string().min(1),
    gaming: z.string().min(1),
    links: z.string().min(1),
  }),
  /** Títulos y textos de las secciones del home. */
  sections: z.object({
    /** Lo que se muestra en lugar del término de un periodo vigente. */
    current: z.string().min(1),
    experience: z.object({ title: z.string().min(1), unit: plural, since: z.string().min(1) }),
    education: z.object({
      title: z.string().min(1),
      degree: plural,
      cert: plural,
      training: plural,
      folio: z.string().min(1),
    }),
    projects: z.object({
      title: z.string().min(1),
      unit: plural,
      featured: plural,
      repo: z.string().min(1),
      demo: z.string().min(1),
      caseStudy: z.string().min(1),
    }),
    skills: z.object({ title: z.string().min(1), groups: plural, items: plural }),
    contact: z.object({
      /** Línea de terminal sobre el título, p. ej. `$ ./contacto.sh`. */
      kicker: z.string().min(1),
      /** El último carácter se pinta con el degradado. */
      title: z.string().min(2),
      copy: z.string().min(1),
      copied: z.string().min(1),
    }),
  }),
  /** Textos de los botones de contacto (hero y sección Contacto). */
  labels: z.object({
    email: z.string().min(1),
    github: z.string().min(1),
    linkedin: z.string().min(1),
    cv: z.string().min(1),
  }),
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
  .refine(endAfterStart, endAfterStartError)
  .refine(hasDateNote, dateNoteError);

export const educationSchema = z
  .object({
    id,
    institution: z.string().min(1),
    title: z.string().min(1),
    ...period,
    type: z.enum(['degree', 'cert', 'training']),
    folio: z.string().regex(/^\d+$/).optional(),
    url: z.url().optional(),
  })
  .refine(endAfterStart, endAfterStartError)
  .refine(hasDateNote, dateNoteError);

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

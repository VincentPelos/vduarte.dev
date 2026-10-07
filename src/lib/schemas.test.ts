import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import {
  educationSchema,
  experienceSchema,
  month,
  projectSchema,
  siteSchema,
  skillGroupSchema,
} from './schemas';

/** Rutas de los campos con error, para afirmar qué campo falló. */
const errorPaths = (result: { success: boolean; error?: z.ZodError }) =>
  result.error?.issues.map((issue) => issue.path.join('.')) ?? [];

const site = {
  name: 'Vicente Duarte',
  role: 'Ingeniero de Software & Datos',
  tagline: 'Construyo software y convierto datos en decisiones.',
  bio: 'Bio de prueba.',
  available: true,
  location: 'Chile',
  timezone: 'America/Santiago',
  email: 'hola@vduarte.dev',
  github: 'https://github.com/VincentPelos',
  linkedin: 'https://www.linkedin.com/in/ejemplo',
  cvPath: '/cv.pdf',
  highlightStack: ['TypeScript', 'Python'],
  nowPlaying: { song: 'Canción', artist: 'Banda' },
  nowGaming: { title: 'Juego' },
  nav: [{ section: 'inicio', label: '~/', ariaLabel: 'Inicio' }],
  footerNote: 'Hecho con Astro',
  prompt: { user: 'vicente@vduarte', command: 'whoami' },
  labels: { email: 'Correo', github: 'GitHub', linkedin: 'LinkedIn', cv: 'Descargar CV' },
};

const experience = {
  id: 'empresa-ejemplo',
  company: 'Empresa',
  role: 'Desarrollador',
  start: '2023-03',
  end: null,
  description: 'Descripción.',
};

describe('month', () => {
  it('acepta AAAA-MM y rechaza otros formatos', () => {
    expect(month.safeParse('2023-03').success).toBe(true);
    expect(month.safeParse('2023-3').success).toBe(false);
    expect(month.safeParse('2023-13').success).toBe(false);
  });
});

describe('siteSchema', () => {
  it('acepta un perfil completo', () => {
    expect(siteSchema.safeParse(site).success).toBe(true);
  });

  it('nombra el campo que falta', () => {
    expect(errorPaths(siteSchema.safeParse({ ...site, email: undefined }))).toEqual(['email']);
  });

  it('rechaza zonas horarias, urls y rutas de CV inválidas', () => {
    const result = siteSchema.safeParse({
      ...site,
      timezone: 'Marte/Olympus',
      github: 'github.com/sin-protocolo',
      cvPath: 'cv.pdf',
    });
    expect(errorPaths(result).sort()).toEqual(['cvPath', 'github', 'timezone']);
  });

  it('exige al menos un enlace en la nav con id de sección válido', () => {
    expect(errorPaths(siteSchema.safeParse({ ...site, nav: [] }))).toEqual(['nav']);
    expect(
      errorPaths(siteSchema.safeParse({ ...site, nav: [{ section: '#inicio', label: '~/' }] })),
    ).toEqual(['nav.0.section']);
  });
});

describe('experienceSchema', () => {
  it('acepta un trabajo actual (end: null)', () => {
    expect(experienceSchema.safeParse(experience).success).toBe(true);
  });

  it('exige id en kebab-case', () => {
    expect(errorPaths(experienceSchema.safeParse({ ...experience, id: 'Empresa X' }))).toEqual([
      'id',
    ]);
  });

  it('rechaza un término anterior al inicio', () => {
    const result = experienceSchema.safeParse({ ...experience, end: '2022-01' });
    expect(errorPaths(result)).toEqual(['end']);
  });
});

describe('educationSchema', () => {
  it('solo acepta los tipos degree y cert', () => {
    const base = {
      id: 'aiep',
      institution: 'AIEP',
      title: 'Ingeniería en Programación',
      start: '2022-03',
      end: null,
    };
    expect(educationSchema.safeParse({ ...base, type: 'degree' }).success).toBe(true);
    expect(errorPaths(educationSchema.safeParse({ ...base, type: 'curso' }))).toEqual(['type']);
  });
});

describe('skillGroupSchema', () => {
  it('valida el formato de ícono de Iconify', () => {
    const group = { id: 'datos', group: 'Datos', items: [{ name: 'Python', icon: 'python' }] };
    expect(errorPaths(skillGroupSchema.safeParse(group))).toEqual(['items.0.icon']);
  });
});

describe('projectSchema', () => {
  const schema = projectSchema(() => z.string());
  const project = {
    id: 'colchagua',
    title: 'Colchagua',
    description: 'Caso de BI.',
    tags: ['Power BI'],
    year: 2026,
  };

  it('marca featured como false por defecto', () => {
    const result = schema.safeParse(project);
    expect(result.success && result.data.featured).toBe(false);
  });

  it('exige que caseStudy sea un slug', () => {
    expect(errorPaths(schema.safeParse({ ...project, caseStudy: 'Caso Colchagua' }))).toEqual([
      'caseStudy',
    ]);
  });
});

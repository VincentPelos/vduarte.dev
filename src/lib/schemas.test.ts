import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import {
  aiUsageSchema,
  caseSchema,
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
  bioTitle: 'Título de prueba.',
  bio: 'Bio de prueba.',
  available: true,
  location: 'Chile',
  timezone: 'America/Santiago',
  email: 'hola@vduarte.dev',
  github: 'https://github.com/VincentPelos',
  linkedin: 'https://www.linkedin.com/in/ejemplo',
  cvPath: '/cv.pdf',
  highlightStack: ['TypeScript', 'Python'],
  nav: [{ section: 'inicio', label: '~/', ariaLabel: 'Inicio' }],
  footerNote: 'Hecho con Astro',
  scrollCue: { label: 'portafolio', ariaLabel: 'Bajar al portafolio' },
  prompt: { user: 'vicente@vduarte', command: 'whoami' },
  labels: {
    email: 'Correo',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Descargar CV',
    pending: 'Pendiente de publicación',
    newTab: 'abre en otra pestaña',
  },
  bento: {
    about: 'Sobre mí',
    status: 'Estado',
    available: 'Disponible',
    unavailable: 'No disponible',
    stack: 'Stack principal',
    links: 'Encuéntrame',
    areas: (['dev', 'datos', 'infra', 'agentes'] as const).map((art) => ({
      art,
      title: 'Área',
      proof: 'Prueba',
      cta: 'ver',
      href: '#proyectos',
    })),
  },
  constellations: {
    experience: '>_',
    projects: '</>',
    skills: '#',
    education: 'π',
    contact: '?',
  },
  sections: {
    current: 'actual',
    experience: {
      title: 'Experiencia',
      unit: { one: 'rol', other: 'roles' },
      since: 'desde',
      highlights: { show: 'ver logros', hide: 'ocultar logros' },
    },
    education: {
      title: 'Educación',
      degree: { one: 'título', other: 'títulos' },
      cert: { one: 'certificación', other: 'certificaciones' },
      training: { one: 'capacitación', other: 'capacitaciones' },
      folio: 'folio',
    },
    projects: {
      title: 'Proyectos',
      unit: { one: 'proyecto', other: 'proyectos' },
      featured: { one: 'destacado', other: 'destacados' },
      repo: 'repo',
      demo: 'demo',
      caseStudy: 'ver caso',
      gallery: { open: 'Ver', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente', of: 'de' },
    },
    skills: {
      title: 'Skills',
      groups: { one: 'grupo', other: 'grupos' },
      items: { one: 'herramienta', other: 'herramientas' },
    },
    contact: {
      kicker: '$ ./contacto.sh',
      title: '¿Hablamos?',
      copy: 'Copiar correo',
      copied: 'Copiado',
    },
  },
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

  it('acepta un perfil sin enlaces pendientes de LinkedIn ni CV', () => {
    expect(siteSchema.safeParse({ ...site, linkedin: undefined, cvPath: undefined }).success).toBe(
      true,
    );
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

  it('acepta fechas pendientes con una nota visible', () => {
    expect(
      experienceSchema.safeParse({
        ...experience,
        start: null,
        dateNote: 'Desde marzo',
        ongoing: true,
      }).success,
    ).toBe(true);
  });

  it('exige una nota cuando falta la fecha de inicio', () => {
    expect(errorPaths(experienceSchema.safeParse({ ...experience, start: null }))).toEqual([
      'dateNote',
    ]);
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

  it('registra capacitaciones con folio sin llamarlas certificaciones', () => {
    const training = {
      id: 'docdigital',
      institution: 'Gobierno Digital',
      title: 'DocDigital',
      start: '2026-07-23',
      end: '2026-07-23',
      type: 'training',
      folio: '20482762',
    };
    expect(educationSchema.safeParse(training).success).toBe(true);
    expect(errorPaths(educationSchema.safeParse({ ...training, start: '2026-02-31' }))).toEqual([
      'start',
    ]);
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

describe('caseSchema', () => {
  const schema = caseSchema(() => z.string());
  const url = 'https://github.com/usuario/repo';
  const bars = {
    type: 'bars',
    max: 60,
    items: [{ label: 'Chimbarongo', value: 58.9, display: '58,9 %' }],
  };
  const base = {
    id: 'colchagua',
    title: 'Caso',
    subtitle: 'Subtítulo',
    context: 'Curso',
    question: '¿Pregunta?',
    stats: [{ value: '38 %', label: 'de los frutales' }],
    dashboard: { title: 'El dashboard', take: '5 páginas.' },
    gallery: [{ image: 'captura.png', alt: 'Mapa', caption: 'Mapa' }],
    blocks: [
      {
        id: 'la-cereza',
        file: 'hallazgos/la-cereza.md',
        title: 'Título',
        take: 'Texto.',
        panels: [{ title: 'Panel', source: 'SII', chart: bars }],
      },
    ],
    conclusions: { title: 'Qué hacer', answer: 'Respuesta.', actions: ['Acción.'] },
    limitations: { title: 'Límites', items: [{ title: 'Asociación', body: 'No causalidad.' }] },
    process: { title: 'Cómo se hizo', text: 'ETL → Datamart → Power BI.' },
    resources: { repo: url, dashboard: url, report: url, notebooks: [{ title: '01', href: url }] },
    labels: {
      back: 'proyectos',
      download: 'Descargar',
      report: 'Informe',
      repo: 'Repo',
      notebooks: 'Notebooks',
    },
  };

  it('acepta un caso completo y parte las barras desde 0 por defecto', () => {
    const result = schema.safeParse(base);
    expect(result.success && result.data.blocks[0].panels[0].chart).toMatchObject({ min: 0 });
  });

  it('exige declarar al menos un límite del análisis', () => {
    const limitations = { title: 'Límites', items: [] };
    expect(errorPaths(schema.safeParse({ ...base, limitations }))).toEqual(['limitations.items']);
  });

  it('exige dos leyendas en un gráfico de pares', () => {
    const pairs = {
      type: 'pairs',
      max: 10,
      legend: ['2021'],
      items: [{ label: 'Cerezo', before: 1, after: 2, display: '2' }],
    };
    const blocks = [{ ...base.blocks[0], panels: [{ title: 'P', source: 'S', chart: pairs }] }];
    expect(errorPaths(schema.safeParse({ ...base, blocks }))).toEqual([
      'blocks.0.panels.0.chart.legend',
    ]);
  });

  it('exige URLs válidas en los recursos', () => {
    expect(
      errorPaths(
        schema.safeParse({ ...base, resources: { ...base.resources, report: 'informe.pdf' } }),
      ),
    ).toEqual(['resources.report']);
  });
});

describe('aiUsageSchema', () => {
  const row = { task: 'Código', ai: 'Escribió.', author: 'Revisé.' };
  const base = {
    id: 'main',
    title: 'Uso de IA',
    subtitle: 'Subtítulo',
    intro: 'Intro.',
    tools: [{ name: 'Claude Code', maker: 'Anthropic', use: 'Código.' }],
    projects: [
      { id: 'sitio', file: 'vduarte.dev', title: 'Este sitio', decidedBy: 'Yo', rows: [row] },
    ],
    checks: { title: 'Cómo se verificó', items: ['Tests.'] },
    links: [{ label: 'Bitácoras', href: 'https://github.com/usuario/repo' }],
    labels: { back: 'volver', ai: 'La IA', links: 'Registro' },
  };

  it('acepta una declaración completa', () => {
    expect(aiUsageSchema.safeParse(base).success).toBe(true);
  });

  it('exige decir qué decidió una persona en cada tarea', () => {
    const projects = [{ ...base.projects[0], rows: [{ ...row, author: '' }] }];
    expect(errorPaths(aiUsageSchema.safeParse({ ...base, projects }))).toEqual([
      'projects.0.rows.0.author',
    ]);
  });
});

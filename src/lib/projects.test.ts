import { describe, expect, it } from 'vitest';
import { fileName, initialSkill, projectLinks, signalTime, sortProjects } from './projects';

describe('sortProjects', () => {
  const projects = [
    { title: 'Viejo', year: 2023 },
    { title: 'Destacado viejo', year: 2024, featured: true },
    { title: 'Nuevo B', year: 2026 },
    { title: 'Nuevo A', year: 2026, featured: false },
    { title: 'Destacado nuevo', year: 2026, featured: true },
    { title: 'Destacado con caso', year: 2024, featured: true, caseStudy: 'caso' },
  ];

  it('pone los destacados primero, los con caso antes, y ordena por año y título', () => {
    expect(sortProjects(projects).map((p) => p.title)).toEqual([
      'Destacado con caso',
      'Destacado nuevo',
      'Destacado viejo',
      'Nuevo A',
      'Nuevo B',
      'Viejo',
    ]);
  });

  it('no modifica el arreglo original', () => {
    const copy = [...projects];
    sortProjects(projects);
    expect(projects).toEqual(copy);
  });
});

describe('projectLinks', () => {
  const labels = { caseStudy: 'ver caso', repo: 'repo', demo: 'demo' };

  it('ordena caso, repo y demo, y omite los que faltan', () => {
    expect(projectLinks({ caseStudy: 'colchagua', demo: 'https://ejemplo.cl' }, labels)).toEqual([
      { href: '/proyectos/colchagua', text: 'ver caso →' },
      { href: 'https://ejemplo.cl', text: 'demo ↗' },
    ]);
  });

  it('devuelve una lista vacía sin enlaces', () => {
    expect(projectLinks({}, labels)).toEqual([]);
  });
});

describe('fileName', () => {
  it('toma el último tramo de la ruta, sin la barra final', () => {
    expect(fileName('https://github.com/u/r/blob/main/notebooks/02_ETL_limpieza.ipynb')).toBe(
      '02_ETL_limpieza.ipynb',
    );
    expect(fileName('https://github.com/u/r/tree/main/notebooks/')).toBe('notebooks');
  });
});

describe('signalTime', () => {
  it('parte en 0, termina en 1 y crece', () => {
    expect(signalTime(0)).toBeCloseTo(0, 3);
    expect(signalTime(1)).toBeCloseTo(1, 3);
    expect(signalTime(0.3)).toBeLessThan(signalTime(0.6));
  });

  it('la curva arranca lenta: el primer tramo del recorrido toma más tiempo', () => {
    expect(signalTime(0.1)).toBeGreaterThan(0.1);
  });
});

describe('projectLinks con demoLabel', () => {
  it('usa el texto propio del proyecto para la demo', () => {
    const labels = { caseStudy: 'ver caso', repo: 'repo', demo: 'sitio institucional' };
    expect(projectLinks({ demo: 'https://ejemplo.dev', demoLabel: 'sitio' }, labels)).toEqual([
      { href: 'https://ejemplo.dev', text: 'sitio ↗' },
    ]);
  });
});

describe('initialSkill', () => {
  const skills = [{ name: 'Python' }, { name: 'React' }];

  it('usa la skill elegida en el contenido', () => {
    expect(initialSkill({ skill: 'React', skills })).toBe('React');
  });

  it('sin elegida, la primera', () => {
    expect(initialSkill({ skills })).toBe('Python');
  });
});

import { describe, expect, it } from 'vitest';
import { projectLinks, sortProjects } from './projects';

describe('sortProjects', () => {
  const projects = [
    { title: 'Viejo', year: 2023 },
    { title: 'Destacado viejo', year: 2024, featured: true },
    { title: 'Nuevo B', year: 2026 },
    { title: 'Nuevo A', year: 2026, featured: false },
    { title: 'Destacado nuevo', year: 2026, featured: true },
  ];

  it('pone los destacados primero y ordena por año y título', () => {
    expect(sortProjects(projects).map((p) => p.title)).toEqual([
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

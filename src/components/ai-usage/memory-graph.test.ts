import { describe, expect, it } from 'vitest';
import {
  buildGraph,
  memoryGraph,
  noteKind,
  noteLinks,
  noteTitle,
  resolveLink,
} from './memory-graph';

describe('noteKind', () => {
  it('separa el índice, las decisiones, las bitácoras y las notas', () => {
    expect(noteKind('00-index.md')).toBe('index');
    expect(noteKind('03-decisiones/001-astro.md')).toBe('decision');
    expect(noteKind('06-bitacora/2026-10-12.md')).toBe('log');
    expect(noteKind('02-arquitectura/stack.md')).toBe('note');
  });
});

describe('noteTitle', () => {
  it('toma el primer encabezado y quita los backticks', () => {
    expect(noteTitle('a.md', '---\ntags: []\n---\n\n# 016 · `sharp` para imágenes\n## Otro')).toBe(
      '016 · sharp para imágenes',
    );
  });

  it('sin encabezado usa el nombre del archivo', () => {
    expect(noteTitle('06-bitacora/2026-10-05.md', 'texto')).toBe('2026-10-05');
  });
});

describe('resolveLink', () => {
  it('resuelve rutas relativas dentro de docs', () => {
    expect(resolveLink('01-proyecto/pendientes.md', '../03-decisiones/013-x.md')).toBe(
      '03-decisiones/013-x.md',
    );
    expect(resolveLink('00-index.md', '06-bitacora/2026-10-12.md')).toBe(
      '06-bitacora/2026-10-12.md',
    );
  });

  it('devuelve null si el enlace sale de docs', () => {
    expect(resolveLink('00-index.md', '../AGENTS.md')).toBeNull();
  });
});

describe('noteLinks', () => {
  it('lee los enlaces a notas, sin anclas, externos ni repetidos', () => {
    const source = [
      '[a](../02-arquitectura/stack.md) [b](../02-arquitectura/stack.md#instalado)',
      '[c](guia.html) [d](https://example.com/x.md) [e](../../CHANGELOG.md)',
    ].join('\n');
    expect(noteLinks('04-diseno/tokens.md', source)).toEqual(['02-arquitectura/stack.md']);
  });
});

describe('buildGraph', () => {
  const files = {
    '00-index.md': '# Índice\n[x](01-a.md) [y](02-b.md)',
    '01-a.md': '# A\n[índice](00-index.md) [b](02-b.md)',
    '02-b.md': '# B',
    '03-c.md': '# C\n[fuera](../README.md)',
  };

  it('une cada par de notas una sola vez, sin importar el sentido', () => {
    const { nodes, edges } = buildGraph(files);
    expect(nodes.map((node) => node.path)).toEqual([
      '00-index.md',
      '01-a.md',
      '02-b.md',
      '03-c.md',
    ]);
    expect(edges).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
    expect(nodes.map((node) => node.degree)).toEqual([2, 2, 2, 0]);
  });

  it('ubica cada nota en una celda distinta de la grilla y dentro de la caja', () => {
    const graph = memoryGraph(files, { width: 300, height: 200, cell: 6, padding: 12 });
    const cells = new Set(graph.nodes.map((node) => `${node.x},${node.y}`));
    expect(cells.size).toBe(4);
    for (const node of graph.nodes) {
      expect(node.x % 6).toBe(0);
      expect(node.y % 6).toBe(0);
      expect(node.x).toBeGreaterThanOrEqual(6);
      expect(node.x).toBeLessThanOrEqual(300);
      expect(node.y).toBeLessThanOrEqual(200);
    }
  });

  it('da el mismo layout en cada build', () => {
    expect(memoryGraph(files)).toEqual(memoryGraph(files));
  });
});

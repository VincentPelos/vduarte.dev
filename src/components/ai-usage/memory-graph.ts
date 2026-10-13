/**
 * Grafo de la memoria del proyecto (#177): cada nota de `docs/` es un nodo y cada enlace
 * markdown entre dos notas, una arista. Todo se calcula en el build, también el layout, así que
 * la página recibe un SVG ya armado y solo necesita JS para resaltar al pasar el mouse.
 */

export type NoteKind = 'index' | 'note' | 'decision' | 'log';

export interface MemoryNode {
  /** Ruta dentro de `docs/`: `03-decisiones/022-twgl-escenas.md`. */
  path: string;
  title: string;
  kind: NoteKind;
  /** Enlaces con otras notas, en ambos sentidos. */
  degree: number;
  /** Saltos desde el índice: ordena la entrada en ola. Las notas sueltas van al final. */
  depth: number;
  x: number;
  y: number;
}

export interface MemoryGraph {
  nodes: MemoryNode[];
  /** Índices de `nodes`, sin repetir ni sentido. */
  edges: [number, number][];
  width: number;
  height: number;
}

/** Tipo de nota según su carpeta: el índice, una decisión, una bitácora o una nota viva. */
export function noteKind(path: string): NoteKind {
  if (path === '00-index.md') return 'index';
  if (path.startsWith('03-decisiones/')) return 'decision';
  if (path.startsWith('06-bitacora/')) return 'log';
  return 'note';
}

/** El primer `# título` de la nota; si no tiene, el nombre del archivo. */
export function noteTitle(path: string, source: string): string {
  const heading = /^# (.+)$/m.exec(source)?.[1];
  return (heading ?? path.split('/').pop()!.replace(/\.md$/, '')).replaceAll('`', '').trim();
}

/** Resuelve un enlace relativo desde una nota a una ruta dentro de `docs/`, o `null` si sale. */
export function resolveLink(from: string, href: string): string | null {
  const parts = from.split('/').slice(0, -1);
  for (const part of href.split('/')) {
    if (part === '..') {
      if (!parts.length) return null;
      parts.pop();
    } else if (part !== '.' && part !== '') parts.push(part);
  }
  return parts.join('/');
}

/** Notas de `docs/` a las que enlaza una nota (sin anclas, externos ni archivos que no son notas). */
export function noteLinks(path: string, source: string): string[] {
  const links = [...source.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g)].flatMap(([, href]) => {
    if (/^[a-z]+:/i.test(href!)) return [];
    const target = resolveLink(path, decodeURI(href!));
    return target ? [target] : [];
  });
  return [...new Set(links)];
}

/** Nodos y aristas a partir de las notas (`{ ruta: contenido }`), todavía sin posición. */
export function buildGraph(files: Record<string, string>): {
  nodes: Omit<MemoryNode, 'x' | 'y' | 'depth'>[];
  edges: [number, number][];
} {
  const paths = Object.keys(files).sort();
  const index = new Map(paths.map((path, i) => [path, i]));
  const keys = new Set<string>();
  const edges: [number, number][] = [];
  for (const [i, path] of paths.entries()) {
    for (const target of noteLinks(path, files[path]!)) {
      const j = index.get(target);
      if (j === undefined || j === i) continue;
      const pair: [number, number] = i < j ? [i, j] : [j, i];
      const key = pair.join('-');
      if (keys.has(key)) continue;
      keys.add(key);
      edges.push(pair);
    }
  }
  const degree = paths.map(() => 0);
  for (const [a, b] of edges) {
    degree[a]!++;
    degree[b]!++;
  }
  const nodes = paths.map((path, i) => ({
    path,
    title: noteTitle(path, files[path]!),
    kind: noteKind(path),
    degree: degree[i]!,
  }));
  return { nodes, edges };
}

/** Saltos de cada nodo desde `start` (búsqueda en anchura); los que no alcanza, el máximo + 1. */
export function depths(count: number, edges: [number, number][], start: number): number[] {
  const neighbors = Array.from({ length: count }, () => [] as number[]);
  for (const [a, b] of edges) {
    neighbors[a]!.push(b);
    neighbors[b]!.push(a);
  }
  const depth: number[] = Array.from({ length: count }, () => -1);
  if (start >= 0 && start < count) {
    depth[start] = 0;
    const queue = [start];
    for (let i = 0; i < queue.length; i++) {
      for (const next of neighbors[queue[i]!]!) {
        if (depth[next] !== -1) continue;
        depth[next] = depth[queue[i]!]! + 1;
        queue.push(next);
      }
    }
  }
  const max = Math.max(0, ...depth);
  return depth.map((d) => (d === -1 ? max + 1 : d));
}

interface LayoutOptions {
  width: number;
  height: number;
  /** Celda de la grilla de puntos: las posiciones finales caen en múltiplos de ella. */
  cell: number;
  padding: number;
  iterations: number;
}

/**
 * Layout de fuerzas (Fruchterman–Reingold) determinista: parte de una espiral, sin azar, para
 * que el grafo salga igual en cada build. Al final se ajusta a la caja y cada nodo cae en la
 * grilla de puntos del sitio (decisión 008), sin dos nodos en la misma celda.
 */
export function layout(
  count: number,
  edges: [number, number][],
  { width, height, cell, padding, iterations }: LayoutOptions,
): { x: number; y: number }[] {
  const area = width * height;
  const k = Math.sqrt(area / Math.max(count, 1)) * 0.75;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pos = Array.from({ length: count }, (_, i) => {
    const r = Math.sqrt(i + 0.5) * k * 0.5;
    return { x: Math.cos(i * golden) * r, y: Math.sin(i * golden) * r };
  });

  let temperature = width / 8;
  for (let step = 0; step < iterations; step++) {
    const disp = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i]!.x - pos[j]!.x;
        const dy = pos[i]!.y - pos[j]!.y;
        const dist = Math.max(Math.hypot(dx, dy), 0.01);
        const force = (k * k) / dist;
        disp[i]!.x += (dx / dist) * force;
        disp[i]!.y += (dy / dist) * force;
        disp[j]!.x -= (dx / dist) * force;
        disp[j]!.y -= (dy / dist) * force;
      }
    }
    for (const [a, b] of edges) {
      const dx = pos[a]!.x - pos[b]!.x;
      const dy = pos[a]!.y - pos[b]!.y;
      const dist = Math.max(Math.hypot(dx, dy), 0.01);
      const force = (dist * dist) / k;
      disp[a]!.x -= (dx / dist) * force;
      disp[a]!.y -= (dy / dist) * force;
      disp[b]!.x += (dx / dist) * force;
      disp[b]!.y += (dy / dist) * force;
    }
    for (const [i, p] of pos.entries()) {
      // Gravedad suave hacia el centro, para que las notas sueltas no se vayan al borde.
      const d = disp[i]!;
      d.x -= p.x * 0.02 * k;
      d.y -= p.y * 0.02 * k * (width / height);
      const len = Math.max(Math.hypot(d.x, d.y), 0.01);
      p.x += (d.x / len) * Math.min(len, temperature);
      p.y += (d.y / len) * Math.min(len, temperature);
    }
    temperature = Math.max(temperature * 0.97, 1);
  }

  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const sx = (width - padding * 2) / Math.max(maxX - minX, 1);
  const sy = (height - padding * 2) / Math.max(maxY - minY, 1);
  const taken = new Set<string>();
  return pos.map((p) => {
    let gx = Math.round((padding + (p.x - minX) * sx) / cell);
    const gy = Math.round((padding + (p.y - minY) * sy) / cell);
    while (taken.has(`${gx},${gy}`)) gx++;
    taken.add(`${gx},${gy}`);
    return { x: gx * cell, y: gy * cell };
  });
}

/** El grafo completo y ubicado, listo para dibujarse en un `viewBox` de `width × height`. */
export function memoryGraph(
  files: Record<string, string>,
  { width = 1000, height = 640, cell = 6, padding = 30, iterations = 400 } = {},
): MemoryGraph {
  const { nodes, edges } = buildGraph(files);
  const points = layout(nodes.length, edges, { width, height, cell, padding, iterations });
  const depth = depths(
    nodes.length,
    edges,
    nodes.findIndex((node) => node.kind === 'index'),
  );
  return {
    nodes: nodes.map((node, i) => ({ ...node, ...points[i]!, depth: depth[i]! })),
    edges,
    width,
    height,
  };
}

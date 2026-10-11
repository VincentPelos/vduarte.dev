/** Funciones puras de la cinemática de constelaciones (ver components/layout/star-sky.ts). */

import type { Rgb } from './scene';

export type { Rgb };

export interface Segment {
  /** Índice de la sección de la que se viene. */
  from: number;
  /** Índice de la sección a la que se va (igual a `from` en la última). */
  to: number;
  /** 0 en el centro de `from`, 1 en el centro de `to`. */
  progress: number;
}

/**
 * En qué tramo entre secciones está el scroll. `centers` es, para cada sección, el valor
 * de scroll en que queda centrada en pantalla (en orden).
 */
export function segment(centers: readonly number[], scroll: number): Segment {
  // Una página sin secciones con constelación (el caso de un proyecto): el cielo queda quieto.
  if (centers.length === 0) return { from: 0, to: 0, progress: 0 };
  let from = 0;
  while (from < centers.length - 1 && scroll >= centers[from + 1]) from++;
  const to = Math.min(from + 1, centers.length - 1);
  if (to === from) return { from, to, progress: 0 };
  const progress = (scroll - centers[from]) / (centers[to] - centers[from]);
  return { from, to, progress: Math.min(1, Math.max(0, progress)) };
}

/** Curva suave entre 0 y 1 (smoothstep), con la entrada acotada. */
export function smooth(k: number): number {
  const x = Math.min(1, Math.max(0, k));
  return x * x * (3 - 2 * x);
}

export function mixRgb(a: Rgb, b: Rgb, k: number): Rgb {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

/** Degradado de tres colores: 0 → primero, 0.5 → segundo, 1 → tercero. */
export function palette(colors: readonly [Rgb, Rgb, Rgb], k: number): Rgb {
  const x = Math.min(1, Math.max(0, k));
  return x < 0.5 ? mixRgb(colors[0], colors[1], x * 2) : mixRgb(colors[1], colors[2], x * 2 - 1);
}

/**
 * Color del disco del agujero negro a un radio dado (en radios de Schwarzschild, desde 3):
 * la misma temperatura tipo Novikov-Thorne que usa el shader, así las estrellas que salen
 * del disco nacen con su color.
 */
export function diskColor(colors: readonly [Rgb, Rgb, Rgb], radius: number): Rgb {
  const r = Math.max(3, radius);
  const t = (Math.pow(3 / r, 0.75) * Math.pow(Math.max(1 - Math.sqrt(3 / r), 0), 0.25)) / 0.488;
  const white = Math.min(1, Math.max(0, (t - 1.1) / 0.7)) * 0.6;
  return mixRgb(palette(colors, t * 0.9), [255, 255, 255], white);
}

/** Hasta `n` elementos repartidos parejo a lo largo de la lista (no al azar). */
export function evenly<T>(list: readonly T[], n: number): T[] {
  if (list.length <= n) return [...list];
  const step = list.length / n;
  return list.filter((_, i) => i % step < 1);
}

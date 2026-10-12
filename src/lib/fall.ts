/**
 * Caída al agujero negro al pasar del hero al portafolio (decisión 018). `hero-fall.ts` escribe
 * el avance y black-hole.ts lo lee en cada cuadro para acercar la cámara.
 */
export const fall = {
  /** Avance de la caída: 0 = hero normal, 1 = la sombra llena la pantalla. */
  progress: 0,
};

/** Duración de la caída hacia el portafolio (ms). Valor elegido por el autor en el laboratorio. */
export const FALL_MS = 1000;
/** Radio de la sombra en radios de Schwarzschild. */
export const SHADOW_RS = 2.6;
/** Con "apagado del texto" en 60 %, el texto del hero desaparece a esta altura de la caída. */
const TEXT_GONE_AT = 1 - 0.6 * 0.85;

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/** Aceleración y frenado suaves (cúbica). */
export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/**
 * Zoom con el que la sombra del agujero, en `hole` (px), cubre la esquina más lejana de una
 * escena de `width` × `height`.
 */
export function coverZoom(
  hole: readonly [number, number],
  width: number,
  height: number,
  pxPerRs: number,
): number {
  const far = Math.hypot(Math.max(hole[0], width - hole[0]), Math.max(hole[1], height - hole[1]));
  return Math.max(1, far / (SHADOW_RS * pxPerRs) + 0.5);
}

/**
 * Zoom de la cámara para un avance de la caída. Exponencial, así el acercamiento se siente
 * parejo aunque vaya de 1× a 30×.
 */
export function fallZoom(progress: number, maxZoom: number): number {
  return Math.exp(Math.log(Math.max(1, maxZoom)) * easeInOutCubic(clamp01(progress)));
}

/** Opacidad del texto del hero durante la caída: se apaga antes de que la sombra llene todo. */
export function textOpacity(progress: number): number {
  return clamp01(1 - clamp01(progress) / TEXT_GONE_AT);
}

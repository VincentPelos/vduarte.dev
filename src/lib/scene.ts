/** Utilidades compartidas por las escenas animadas (agujero negro del hero y cielo de estrellas). */

export type Rgb = [number, number, number];

/** Px por celda de la grilla de puntos de terminal (también el `bg-size` del respaldo del hero). */
export const CELL = 6;

/** Densidad de píxeles máxima de los canvas: sobre 2 el costo crece y no se nota la diferencia. */
export const MAX_DPR = 2;

export function canvasDpr(): number {
  return Math.min(globalThis.devicePixelRatio || 1, MAX_DPR);
}

/** `#00d1c1` → `[0, 209, 193]`. */
export function hexToRgb(hex: string): Rgb {
  const v = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as Rgb;
}

/** Paleta "Nebulosa" (`--color-c1..c3`) leída de los tokens de CSS. */
export function readPalette(): [Rgb, Rgb, Rgb] {
  const style = getComputedStyle(document.documentElement);
  const color = (name: string) => hexToRgb(style.getPropertyValue(name));
  return [color('--color-c1'), color('--color-c2'), color('--color-c3')];
}

/** Ejecuta `task` cuando el navegador está libre, sin esperar más de `timeout` ms. */
export function whenIdle(task: () => void, timeout = 1500): void {
  if ('requestIdleCallback' in globalThis) requestIdleCallback(task, { timeout });
  else setTimeout(task, 200);
}

/**
 * `true` si el navegador dibuja WebGL por software (sin GPU): SwiftShader, llvmpipe o el driver
 * básico de Windows. Ahí una escena animada corre en la CPU y traba la página (#109).
 */
export function isSoftwareRenderer(renderer: string): boolean {
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

/** Nombre del renderer de un contexto WebGL (el real si el navegador lo expone). */
export function webglRenderer(gl: WebGLRenderingContext): string {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  return String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '');
}

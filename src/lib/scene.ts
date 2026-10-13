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

/** Paleta "Nebulosa" como colores de CSS, para los canvas 2D. */
export function cssPalette(): [string, string, string] {
  return readPalette().map(([r, g, b]) => `rgb(${r} ${g} ${b})`) as [string, string, string];
}

/** Valor de un token de color de `global.css` (`--color-fg`). */
export function cssToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Número pseudoaleatorio estable en [0, 1) para un par de enteros (una celda, un índice). */
export function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Ajusta un canvas 2D a `width` × `height` px CSS con la densidad de píxeles acotada. */
export function fitCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const dpr = canvasDpr();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * Puntos juntados por color y opacidad: cada grupo se rellena con un solo `fill`. Un `fill` por
 * punto era el grueso del costo de los canvas 2D (#192). La opacidad va en pasos de 1/20.
 */
export function dotBatch() {
  const groups = new Map<string, Path2D>();
  return {
    add(x: number, y: number, radius: number, color: string, alpha: number) {
      if (alpha <= 0) return;
      const key = `${Math.round(Math.min(1, alpha) * 20)}|${color}`;
      let path = groups.get(key);
      if (!path) groups.set(key, (path = new Path2D()));
      path.moveTo(x + radius, y);
      path.arc(x, y, radius, 0, Math.PI * 2);
    },
    flush(ctx: CanvasRenderingContext2D) {
      for (const [key, path] of groups) {
        const bar = key.indexOf('|');
        ctx.globalAlpha = Number(key.slice(0, bar)) / 20;
        ctx.fillStyle = key.slice(bar + 1);
        ctx.fill(path);
      }
      groups.clear();
      ctx.globalAlpha = 1;
    },
  };
}

/** Cuadros por segundo de las escenas que se animan solas: en pantallas de 120 Hz no se nota más. */
export const SCENE_FPS = 60;

/**
 * Bucle de cuadros. `tick` recibe el instante del cuadro y los segundos desde el anterior, con
 * tope de 0,05 s para que una pestaña dormida no haga saltar la escena. Si devuelve `false`, el
 * bucle se detiene. Con `maxFps`, se salta cuadros en pantallas más rápidas (el margen de 20 %
 * evita saltarse cuadros de 60 Hz que llegan un poco antes).
 */
export function frameLoop(tick: (now: number, dt: number) => boolean | void, maxFps = Infinity) {
  const minMs = (1000 / maxFps) * 0.8;
  let frame = 0;
  let last = 0;
  const step = (now: number) => {
    if (minMs > 0 && now - last < minMs) {
      frame = requestAnimationFrame(step);
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame = tick(now, dt) === false ? 0 : requestAnimationFrame(step);
  };
  return {
    get running() {
      return frame !== 0;
    },
    start() {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/**
 * Agujero negro del hero: trazado de rayos real dibujado con puntos de terminal.
 *
 * - Precálculo (una vez, al montar): integra el rayo de luz de cada punto de una tabla por el
 *   espacio curvo (Schwarzschild, aceleración de Binet a = -3/2·h²·x/r⁵, en radios de
 *   Schwarzschild) y guarda en texturas si cae al agujero, hacia dónde sale y dónde cruza el
 *   disco. La trayectoria solo depende de la posición relativa al agujero, no del tiempo
 *   (decisión 011).
 * - Pasada 1 (cada cuadro, una celda = un píxel): lee la tabla y aplica lo que cambia con el
 *   tiempo (giro del disco, gas, titileo del cielo) para decidir el punto de cada celda.
 * - Pasada 2 (pantalla): dibuja cada celda como un punto y encima el texto del hero, que
 *   resiste la gravedad: solo se comba y se separa en colores (aberración cromática).
 *
 * Los shaders viven en `shaders/`; aquí solo se orquestan las pasadas con twgl.js (decisión 022).
 *
 * Al pasar al portafolio, la cámara se acerca al agujero hasta que la sombra llena la pantalla
 * (decisión 018): `fall.progress` lo escribe hero-fall.ts.
 *
 * Con `prefers-reduced-motion`: un cuadro estático detrás del texto real, sin deformarlo. Si WebGL
 * va por software (sin GPU), no se monta: queda el respaldo sin WebGL.
 *
 * Interfaz intercambiable: `mount(section, scene, options) → unmount`.
 */

import {
  bindFramebufferInfo,
  createBufferInfoFromArrays,
  createFramebufferInfo,
  createProgramInfo,
  createTexture,
  drawBufferInfo,
  resizeFramebufferInfo,
  setBuffersAndAttributes,
  setTextureFromElement,
  setUniforms,
  type ProgramInfo,
} from 'twgl.js';
import { coverZoom, fall, fallZoom, SHADOW_RS, textOpacity } from '../../../lib/fall';
import { hole as shared } from '../../../lib/hole';
import {
  CELL,
  canvasDpr,
  frameLoop,
  isSoftwareRenderer,
  readPalette,
  webglRenderer,
} from '../../../lib/scene';
import bakeFrag from './shaders/bake.frag?raw';
import common from './shaders/common.glsl?raw';
import drawFrag from './shaders/draw.frag?raw';
import quadVert from './shaders/quad.vert?raw';
import traceFrag from './shaders/trace.frag?raw';

interface Options {
  /** Con `prefers-reduced-motion` se dibuja un solo cuadro, sin animar ni deformar el texto. */
  reducedMotion: boolean;
}

// Valores elegidos por el autor en el laboratorio.
const SPEED = 0.65;
const SCALE = 1.6;
const INTENSITY = 1;
const DOPPLER = 1;

/** Texturas de la tabla: desvío del cielo, tres cruces con el disco y sus factores Doppler. */
const LUT_TEXTURES = 6;
/** Franjas de filas por textura: el precálculo se reparte entre cuadros para no congelar la página. */
const LUT_STRIPS = 8;
/** Tiempo máximo de precálculo por cuadro (ms). */
const BAKE_BUDGET_MS = 8;
/**
 * Tope de trabajos por cuadro, aunque sobre tiempo: `gl.finish()` no siempre espera a la GPU,
 * y sin tope una GPU débil recibiría toda la tabla en un solo cuadro.
 */
const BAKE_MAX_JOBS = LUT_TEXTURES;
/**
 * Entrada de la escena por colapso (decisión 012): la sombra crece hasta cubrir el hero y se
 * contrae de vuelta al agujero con la escena ya entera detrás. Sin pausa en medio ni cola lenta
 * al final: el borde de puntos se deshace mientras llega a la sombra (#132). Valores en ms; el
 * borde, en fracción de 5 celdas de desorden.
 */
const COLLAPSE_GROW_MS = 520;
const COLLAPSE_SHRINK_MS = 900;
const COLLAPSE_EDGE = 0.4;
/** Fracción final de la contracción en que el borde se deshace punto a punto. */
const COLLAPSE_DISSOLVE = 0.45;

/** Dibuja en un canvas 2D cada palabra de los elementos `[data-lens]`, en su posición real. */
function drawText(section: HTMLElement, target: HTMLCanvasElement, dpr: number) {
  const box = section.getBoundingClientRect();
  target.width = Math.max(1, Math.round(box.width * dpr));
  target.height = Math.max(1, Math.round(box.height * dpr));
  const ctx = target.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, box.width, box.height);

  // Se leen los colores reales del texto: un instante sin la clase que lo vuelve transparente.
  const lensing = section.classList.contains('is-lensing');
  section.classList.remove('is-lensing');
  for (const el of section.querySelectorAll<HTMLElement>('[data-lens]')) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const style = getComputedStyle(node.parentElement!);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
      ctx.fillStyle = style.color;
      // Línea base común a todas las palabras (métricas de la fuente, no de cada palabra).
      const metrics = ctx.measureText('Hg');
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      const text = node.textContent ?? '';
      for (const word of text.matchAll(/\S+/g)) {
        const range = document.createRange();
        const start = word.index ?? 0;
        range.setStart(node, start);
        range.setEnd(node, start + word[0].length);
        const rect = range.getBoundingClientRect();
        if (!rect.width) continue;
        const y = rect.top - box.top + (rect.height - ascent - descent) / 2 + ascent;
        ctx.fillText(word[0], rect.left - box.left, y);
      }
    }
  }
  if (lensing) section.classList.add('is-lensing');
}

/** Px por radio de Schwarzschild para una escena de `width` × `height`. */
function pxPerRsFor(width: number, height: number): number {
  return Math.max(8, Math.min(width, height) * 0.022) * SCALE;
}

export function mount(section: HTMLElement, container: HTMLElement, options: Options): () => void {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', {
    antialias: false,
    premultipliedAlpha: false,
    alpha: true,
  });
  if (!gl) return () => {};
  // Sin GPU, WebGL corre en la CPU: solo compilar los shaders tarda segundos y cada cuadro traba
  // la página. Se queda el respaldo sin WebGL (grilla de puntos y texto normal) (#109).
  if (isSoftwareRenderer(webglRenderer(gl))) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return () => {};
  }
  const { reducedMotion } = options;

  // Si un shader no compila, queda la grilla de puntos en CSS y el texto normal.
  const program = (fragment: string) =>
    createProgramInfo(gl, [quadVert, common + fragment], { errorCallback: () => {} });
  const bake = program(bakeFrag);
  const trace = program(traceFrag);
  const draw = program(drawFrag);
  if (!bake || !trace || !draw) return () => {};

  // La escena aparece cuando termina el precálculo (sin fundido: entra por colapso); mientras,
  // la carga del hero.
  canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0`;
  container.append(canvas);
  // Sin animación, la escena va detrás del texto real: el contenido no depende de WebGL.
  if (reducedMotion) container.style.zIndex = '-1';

  // Un triángulo que cubre la pantalla: las tres pasadas son shaders de fragmentos.
  const quad = createBufferInfoFromArrays(gl, {
    aPos: { numComponents: 2, data: [-1, -1, 3, -1, -1, 3] },
  });
  const pass = (info: ProgramInfo, uniforms: Record<string, unknown>) => {
    gl.useProgram(info.program);
    setBuffersAndAttributes(gl, info, quad);
    setUniforms(info, uniforms);
    drawBufferInfo(gl, quad);
  };

  // Tablas y celdas sin interpolar: cada texel es un dato, no un color. `auto: false`: twgl no
  // genera mipmaps (las texturas no son potencia de 2).
  const exact = { min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE, auto: false };
  const cells = createFramebufferInfo(gl, [exact], 1, 1);
  const textTex = createTexture(gl, {
    min: gl.LINEAR,
    mag: gl.LINEAR,
    wrap: gl.CLAMP_TO_EDGE,
    auto: false,
    color: [0, 0, 0, 0],
  });
  const textCanvas = document.createElement('canvas');

  const [uC1, uC2, uC3] = readPalette().map((rgb) => rgb.map((v) => v / 255));
  const palette = { uC1, uC2, uC3 };

  // Tabla de trayectorias: unos 2 texels por celda de la pantalla, entre 128 y 512 por lado.
  // Está en radios de Schwarzschild, así que sirve para cualquier tamaño de pantalla.
  const lutSize = Math.min(
    512,
    Math.max(
      128,
      Math.round((80 * pxPerRsFor(container.clientWidth, container.clientHeight)) / CELL),
    ),
  );
  const lut = Array.from({ length: LUT_TEXTURES }, () =>
    createFramebufferInfo(gl, [exact], lutSize, lutSize),
  );
  const lutUniforms = Object.fromEntries(lut.map((fb, i) => [`uLut${i}`, fb.attachments[0]]));
  bindFramebufferInfo(gl, null);

  let width = 1,
    height = 1,
    dpr = 1,
    pxPerRs = 1;

  const uploadText = () => {
    drawText(section, textCanvas, dpr);
    setTextureFromElement(gl, textTex, textCanvas, { flipY: 1, auto: false });
  };

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    if (!width || !height) return;
    dpr = canvasDpr();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    pxPerRs = pxPerRsFor(width, height);
    section.style.setProperty('--hole-px', String(pxPerRs));
    resizeFramebufferInfo(gl, cells, [exact], Math.ceil(width / CELL), Math.ceil(height / CELL));
    bindFramebufferInfo(gl, null);
    ready = true;
    if (!baked) return;
    // El texto se redibuja en el mismo instante del cambio de tamaño, para que la textura
    // calce siempre con el texto real. Nada se dibuja antes de tenerlo: el nombre nunca desaparece.
    if (!reducedMotion) uploadText();
    if (reducedMotion || !loop.running) render();
    play();
  };
  // Al terminar de cargar una fuente cambian las letras aunque no cambie el tamaño.
  const onFonts = () => {
    if (!ready || !baked || reducedMotion) return;
    uploadText();
    if (!loop.running) render();
  };
  document.fonts?.addEventListener('loadingdone', onFonts);

  let time = 0;
  const render = () => {
    const small = width < 760;
    // Deambula solo y lento; de vez en cuando cruza el nombre.
    const hole = [
      width * ((small ? 0.5 : 0.6) + 0.32 * Math.sin(time * 0.055)),
      height * (0.5 + 0.26 * Math.sin(time * 0.083 + 1.3)),
    ];
    // Se comparte en px de la ventana para que la cinemática haga escapar estrellas del disco.
    const box = container.getBoundingClientRect();
    shared.x = box.left + hole[0];
    shared.y = box.top + height - hole[1];
    // Caída al portafolio: la cámara se acerca al agujero (1× sin caída).
    const zoom =
      fall.progress > 0
        ? fallZoom(fall.progress, coverZoom([hole[0], hole[1]], width, height, pxPerRs))
        : 1;
    shared.px = pxPerRs * zoom;
    shared.time = time;
    shared.ready = true;

    bindFramebufferInfo(gl, cells);
    pass(trace, {
      ...palette,
      ...lutUniforms,
      uHole: hole,
      uPx: pxPerRs,
      uTime: time,
      uInt: INTENSITY,
      uCell: CELL,
      uZoom: zoom,
    });

    const [cover, coverOnly, edgeKeep] = collapse(hole);
    bindFramebufferInfo(gl, null);
    pass(draw, {
      ...palette,
      uCells: cells.attachments[0],
      uText: textTex,
      uGrid: [cells.width, cells.height],
      uRes: [width, height],
      uHole: hole,
      uCell: CELL,
      uDpr: dpr,
      uPx: pxPerRs,
      uLens: reducedMotion ? 0 : 1,
      uTextFade: textOpacity(fall.progress),
      uCover: cover,
      uCoverOnly: coverOnly,
      uEdgeKeep: edgeKeep,
      uEdge: COLLAPSE_EDGE,
    });
  };

  // Colapso de entrada: devuelve el radio de la sombra que cubre (px, -1 = terminado), si fuera
  // de ella todavía no se ve la escena y qué fracción del borde queda. Avanza con el reloj desde
  // el primer cuadro dibujado (no desde el fin del precálculo): si ese cuadro tarda, la sombra
  // no salta a medio crecer.
  let collapseStart = -1;
  const COLLAPSE_PENDING = -2;
  const collapse = (hole: number[]): [number, number, number] => {
    if (collapseStart === COLLAPSE_PENDING) collapseStart = performance.now();
    if (collapseStart < 0) return [-1, 0, 1];
    const t = performance.now() - collapseStart;
    const far =
      Math.hypot(Math.max(hole[0], width - hole[0]), Math.max(hole[1], height - hole[1])) +
      CELL * 4;
    const shadow = SHADOW_RS * pxPerRs;
    if (t < COLLAPSE_GROW_MS) return [shadow + (far - shadow) * (t / COLLAPSE_GROW_MS) ** 3, 1, 1];
    // Con el hero cubierto se cambian la grilla de respaldo y la carga por la escena sin que se note.
    section.classList.add('has-scene');
    section.classList.remove('is-loading');
    const s = (t - COLLAPSE_GROW_MS) / COLLAPSE_SHRINK_MS;
    if (s >= 1) {
      collapseStart = -1;
      return [-1, 0, 1];
    }
    // ease-out cúbico: frena al llegar, pero sin la cola casi quieta del exponencial.
    const keep = Math.min(1, (1 - s) / COLLAPSE_DISSOLVE);
    return [far + (shadow - far) * (1 - (1 - s) ** 3), 0, keep];
  };

  let visible = true,
    ready = false,
    baked = false;
  const loop = frameLoop((_, dt) => {
    time += dt * SPEED;
    render();
  });
  const play = () => {
    if (reducedMotion || !visible || !ready || !baked) return;
    loop.start();
  };

  // Precálculo repartido entre cuadros: cada trabajo es una franja de una textura de la tabla.
  // `--hole-progress` (0..1) mueve la animación de carga del hero.
  const strip = Math.ceil(lutSize / LUT_STRIPS);
  const jobs = Array.from({ length: LUT_TEXTURES * LUT_STRIPS }, (_, i) => ({
    out: Math.floor(i / LUT_STRIPS),
    y: (i % LUT_STRIPS) * strip,
  }));
  let done = 0;
  const bakeStart = performance.now();
  section.classList.add('is-loading');
  section.style.setProperty(
    '--hole-px',
    String(pxPerRsFor(container.clientWidth, container.clientHeight)),
  );

  const reveal = () => {
    performance.measure('black-hole:bake', { start: bakeStart });
    gl.deleteProgram(bake.program);
    lut.forEach(({ framebuffer }) => gl.deleteFramebuffer(framebuffer));
    baked = true;
    if (reducedMotion) {
      // Cuadro quieto detrás del texto real, sin colapso.
      section.classList.remove('is-loading');
      section.classList.add('has-scene');
    } else {
      // La escena entra entera (opacidad 1) bajo el colapso; el texto lo dibuja WebGL desde ya,
      // también sobre la sombra, así que nunca se tapa.
      collapseStart = COLLAPSE_PENDING;
      section.classList.add('is-lensing');
    }
    resize();
    canvas.style.opacity = '1';
  };

  const baking = frameLoop(() => {
    const start = performance.now();
    gl.enable(gl.SCISSOR_TEST);
    const limit = Math.min(jobs.length, done + BAKE_MAX_JOBS);
    do {
      const { out, y } = jobs[done++];
      bindFramebufferInfo(gl, lut[out]);
      gl.scissor(0, y, lutSize, strip);
      pass(bake, { uSize: lutSize, uDoppler: DOPPLER, uOut: out });
      // Espera a la GPU para medir de verdad cuánto costó y no pasarse del presupuesto.
      gl.finish();
    } while (done < limit && performance.now() - start < BAKE_BUDGET_MS);
    gl.disable(gl.SCISSOR_TEST);
    bindFramebufferInfo(gl, null);
    section.style.setProperty('--hole-progress', String(done / jobs.length));
    if (done < jobs.length) return true;
    reveal();
    return false;
  });
  baking.start();

  // El hero queda pegado arriba mientras la hoja del portafolio lo tapa (decisión 014): se ve
  // mientras el borde de la hoja ([data-hero-end]) no haya pasado arriba de la pantalla.
  const end = document.querySelector<HTMLElement>('[data-hero-end]');
  const io = new IntersectionObserver(([entry]) => {
    visible = end ? entry.isIntersecting || entry.boundingClientRect.top > 0 : entry.isIntersecting;
    if (visible) play();
    else loop.stop();
  });
  const ro = new ResizeObserver(resize);
  io.observe(end ?? section);
  ro.observe(container);

  return () => {
    loop.stop();
    baking.stop();
    io.disconnect();
    ro.disconnect();
    document.fonts?.removeEventListener('loadingdone', onFonts);
    section.classList.remove('is-lensing', 'is-loading', 'has-scene');
    container.style.zIndex = '';
    shared.ready = false;
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

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
 * Con `prefers-reduced-motion`: un cuadro estático detrás del texto real, sin deformarlo. Si WebGL
 * va por software (sin GPU), no se monta: queda el respaldo sin WebGL.
 *
 * Interfaz intercambiable: `mount(section, scene, options) → unmount`.
 */

import { hole as shared } from '../../../lib/hole';
import {
  CELL,
  canvasDpr,
  isSoftwareRenderer,
  readPalette,
  webglRenderer,
} from '../../../lib/scene';

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
/** Radio de la sombra en radios de Schwarzschild: el colapso empieza y termina ahí. */
const SHADOW_RS = 2.6;

const VERTEX = `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0., 1.); }
`;

const COMMON = `
  precision highp float;
  uniform vec3 uC1, uC2, uC3;
  const float RIN = 3.;   // órbita estable más interna (ISCO)
  const float ROUT = 13.;
  const float ROLL = -.12;
  const float BMAX = 20.; // radio (en Rs) dentro del cual la luz se desvía; afuera, cielo recto
  const float LP = 400.;  // desvío máximo guardado del cielo (±, en Rs)
  const float GMAX = 2.;  // rango del factor Doppler guardado
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 pal(float k) { k = clamp(k, 0., 1.); return k < .5 ? mix(uC1, uC2, k * 2.) : mix(uC2, uC3, k * 2. - 1.); }
`;

/** Precálculo: un rayo por texel de la tabla. `uOut` elige qué datos escribe esta pasada. */
const BAKE = `
  ${COMMON}
  uniform float uSize, uOut, uDoppler;
  const float D = 32.;    // distancia del observador
  const float TILT = .1;

  // [0, 1] → dos bytes (16 bits) en dos canales.
  vec2 pack16(float v) {
    float x = floor(clamp(v, 0., 1.) * 65535. + .5);
    float hi = floor(x / 256.);
    return vec2(hi, x - hi * 256.) / 255.;
  }

  void main() {
    vec2 rel = (gl_FragCoord.xy / uSize - .5) * 2. * BMAX;
    float b = length(rel);
    if (b > BMAX + .5) { gl_FragColor = vec4(0.); return; }
    float cr = cos(ROLL), sr = sin(ROLL);
    mat2 inv = mat2(cr, sr, -sr, cr);

    vec3 pos = vec3(0., 0., -D), vel = normalize(vec3(rel / D, 1.));
    vec3 hv = cross(pos, vel); float h2 = dot(hv, hv);
    vec3 N = vec3(0., cos(TILT), -sin(TILT));        // normal del disco, casi de canto
    vec3 ex = vec3(1., 0., 0.), ez = normalize(cross(ex, N));
    vec2 q0 = vec2(0.), q1 = vec2(0.), q2 = vec2(0.);
    float g0 = 0., g1 = 0., g2 = 0., n = 0.;
    bool captured = false;
    for (int i = 0; i < 220; i++) {
      float r2 = dot(pos, pos), r = sqrt(r2);
      float dt = clamp(.07 * r, .03, 1.1);
      vec3 prev = pos;
      vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
      pos += vel * dt;
      float s0 = dot(prev, N), s1 = dot(pos, N);
      if (s0 * s1 < 0.) {
        vec3 hit = mix(prev, pos, s0 / (s0 - s1));
        float rh = length(hit);
        if (rh > RIN && rh < ROUT) {
          vec2 q = vec2(dot(hit, ex), dot(hit, ez));
          // Doppler + corrimiento gravitatorio: el lado que se acerca brilla mucho más
          float beta = sqrt(.5 / (rh - 1.)) * uDoppler;
          vec3 k = -normalize(vel);
          float g = mix(1., sqrt(1. - 1. / rh), uDoppler) / ((1. / sqrt(1. - beta * beta)) * (1. - beta * dot(normalize(cross(N, hit)), k)));
          if (n < .5) { q0 = q; g0 = g; } else if (n < 1.5) { q1 = q; g1 = g; } else if (n < 2.5) { q2 = q; g2 = g; }
          n += 1.;
        }
      }
      if (r2 < 1.) { captured = true; break; }
      if (r > D + 4. && dot(pos, vel) > 0.) break;
    }

    // Cuánto se desvía la mirada respecto del cielo recto (en Rs, ya mezclado hacia el borde).
    // Se guarda el desvío y no la posición: lejos del agujero es chico y suave, y la tabla no
    // cambia qué estrella se ve. Raíz cuadrada: más precisión en los desvíos chicos.
    vec2 dv = vec2(0.);
    if (!captured) {
      vec3 d = normalize(vel);
      vec2 look = d.z > .05 ? d.xy / d.z * D : rel * 1e3;
      vec2 defl = inv * (mix(rel, look, 1. - smoothstep(11., 19.5, b)) - rel);
      dv = sign(defl) * sqrt(min(abs(defl) / LP, 1.));
    }

    vec2 qs = vec2(.5 / ROUT);
    if (uOut < .5) gl_FragColor = vec4(pack16(dv.x * .5 + .5), pack16(dv.y * .5 + .5));
    else if (uOut < 1.5) gl_FragColor = vec4(pack16(q0.x * qs.x + .5), pack16(q0.y * qs.y + .5));
    else if (uOut < 2.5) gl_FragColor = vec4(pack16(q1.x * qs.x + .5), pack16(q1.y * qs.y + .5));
    else if (uOut < 3.5) gl_FragColor = vec4(pack16(q2.x * qs.x + .5), pack16(q2.y * qs.y + .5));
    else if (uOut < 4.5) gl_FragColor = vec4(pack16(g0 / GMAX), pack16(g1 / GMAX));
    else gl_FragColor = vec4(pack16(g2 / GMAX), min(n, 3.) / 255., captured ? 1. : 0.);
  }
`;

const TRACE = `
  ${COMMON}
  uniform vec2 uHole;
  uniform float uPx, uTime, uInt, uCell;
  uniform sampler2D uLut0, uLut1, uLut2, uLut3, uLut4, uLut5;

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), w = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), w.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), w.x), w.y);
  }

  float unpack16(vec2 v) { return (floor(v.x * 255. + .5) * 256. + floor(v.y * 255. + .5)) / 65535.; }

  // Cielo de terminal: cada celda tiene un nivel 0..3 (como · • ●). Devuelve color y tamaño.
  vec4 sky(vec2 look) {
    vec2 id = floor(look / uCell); float h = hash(id);
    float lv = h > .996 ? 3. : h > .987 ? 2. : h > .965 ? 1. : 0.;
    if (lv > 0. && hash(id + floor(uTime * 1.2 + h * 9.)) > .86) lv -= 1.;   // titileo por escalones
    float size = lv > 2.5 ? .36 : lv > 1.5 ? .26 : lv > .5 ? .17 : .09;
    vec3 c = lv > .5 ? mix(vec3(1.), pal(hash(id + 9.)), .45) * (lv > 2.5 ? 1. : lv > 1.5 ? .75 : .45) : vec3(.1);
    return vec4(c, size);
  }

  void main() {
    vec2 cc = gl_FragCoord.xy * uCell;               // centro de la celda, en px CSS
    float cr = cos(ROLL), sr = sin(ROLL);
    mat2 rot = mat2(cr, -sr, sr, cr);
    vec2 rel = rot * (cc - uHole) / uPx;
    if (length(rel) > BMAX) { gl_FragColor = sky(cc); return; }

    vec2 uv = rel / (2. * BMAX) + .5;
    vec4 t4 = texture2D(uLut4, uv), t5 = texture2D(uLut5, uv);
    float n = floor(t5.b * 255. + .5);
    vec3 emit = vec3(0.); float trans = 1.;
    for (int i = 0; i < 3; i++) {
      if (float(i) >= n) break;
      vec4 tq = i == 0 ? texture2D(uLut1, uv) : i == 1 ? texture2D(uLut2, uv) : texture2D(uLut3, uv);
      float g = (i == 0 ? unpack16(t4.rg) : i == 1 ? unpack16(t4.ba) : unpack16(t5.rg)) * GMAX;
      vec2 q = (vec2(unpack16(tq.rg), unpack16(tq.ba)) - .5) * 2. * ROUT;
      float rh = length(q);
      float om = pow(rh, -1.5) * 1.8 * uTime;    // giro kepleriano: más rápido adentro
      q = mat2(cos(om), -sin(om), sin(om), cos(om)) * q;
      float gas = .55 * noise(q * 1.3) + .45 * noise(vec2(rh * 3.2, 0.) + q * .4);
      // temperatura del disco delgado (Novikov-Thorne simplificado), máximo ~1
      float T = pow(RIN / rh, .75) * pow(max(1. - sqrt(RIN / rh), 0.), .25) / .488;
      float I = pow(T, 4.) * pow(g, 4.) * (.35 + 1.1 * gas);
      vec3 c = mix(pal(clamp(T * g * .9, 0., 1.)), vec3(1.), smoothstep(1.1, 1.8, T * g) * .6);
      float a = clamp(.35 + .8 * gas, 0., 1.) * smoothstep(RIN, RIN + .7, rh) * smoothstep(ROUT, ROUT - 5., rh);
      emit += trans * a * c * I * 2.2;
      trans *= 1. - a * .8;
    }

    // la sombra es negra sólida (celda completa), para que nada de la página se vea a través
    vec4 s = vec4(0., 0., 0., 1.);
    if (t5.a < .5) {
      vec4 tl = texture2D(uLut0, uv);
      vec2 dv = vec2(unpack16(tl.rg), unpack16(tl.ba)) * 2. - 1.;
      s = sky(cc + sign(dv) * dv * dv * LP * uPx);
      s.rgb *= trans;
    }
    // disco en la grilla: el punto crece por escalones con el brillo
    vec3 e = 1. - exp(-emit * uInt);
    float lum = dot(e, vec3(.3, .59, .11));
    float lvl = floor(clamp(lum * 1.5, 0., 1.) * 4. + .3) / 4.;
    vec3 hue = e / max(max(e.r, max(e.g, e.b)), 1e-3);
    vec4 disk = lvl > .01 ? vec4(hue * min(1., .4 + lum * 1.5), .14 + .3 * lvl) : vec4(0.);
    gl_FragColor = disk.a * dot(disk.rgb, vec3(1.)) > s.a * dot(s.rgb, vec3(1.)) ? disk : s;
  }
`;

const DRAW = `
  ${COMMON}
  uniform sampler2D uCells, uText;
  uniform vec2 uGrid, uRes, uHole;
  uniform float uCell, uDpr, uPx, uLens;
  // Colapso de entrada: radio de la sombra que cubre (px, < 0 = apagado), si fuera de ella
  // todavía no se ve la escena (1 mientras crece) y qué fracción del borde de puntos queda.
  uniform float uCover, uCoverOnly, uEdge, uEdgeKeep;

  vec4 textAt(vec2 px) {
    vec2 uv = px / uRes;
    return (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) ? vec4(0.) : texture2D(uText, uv);
  }

  void main() {
    vec2 px = gl_FragCoord.xy / uDpr;
    vec2 cell = floor(px / uCell);
    vec4 c = texture2D(uCells, (cell + .5) / uGrid);
    if (uCover >= 0.) {
      // Celda entera o nada, con un borde de puntos de la paleta: sin fundidos grises.
      vec2 to = (cell + .5) * uCell - uHole;
      float d = length(to) + (hash(cell) - .5) * uCell * 5. * uEdge;
      if (d < uCover - uCell * 1.2) c = vec4(0., 0., 0., 1.);
      else if (d < uCover && hash(cell + 3.7) < uEdgeKeep) c = vec4(pal(atan(to.y, to.x) / 6.2832 + .5), .3);
      else if (uCoverOnly > .5) c = vec4(0.);
    }
    float r = uCell * c.a;
    // Solo se pintan los puntos y las letras: el resto queda transparente y deja ver la página.
    vec3 col = c.rgb;
    float dotAlpha = smoothstep(r, r - .8, length(px - (cell + .5) * uCell)) * step(.001, c.a);
    if (uLens < .5) { gl_FragColor = vec4(col, dotAlpha); return; }

    // las letras resisten: cerca del agujero se comban y cada canal se dobla distinto
    vec2 rel = (px - uHole) / uPx;
    float r2 = dot(rel, rel);
    vec3 ks = vec3(.8, 1., 1.22) * 6.5 * (1. - smoothstep(4., 10., sqrt(r2)));
    float textAlpha = 0.;
    for (int i = 0; i < 3; i++) {
      vec4 t = textAt(uHole + rel * (1. - ks[i] / (r2 + 5.)) * uPx);
      col[i] = mix(dotAlpha > 0. ? col[i] : t[i], t[i], t.a);
      textAlpha = max(textAlpha, t.a);
    }
    gl_FragColor = vec4(col, max(dotAlpha, textAlpha));
  }
`;

function compile(gl: WebGLRenderingContext, fragment: string): WebGLProgram {
  const program = gl.createProgram()!;
  const parts: [number, string][] = [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, fragment],
  ];
  for (const [type, source] of parts) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
    }
    gl.attachShader(program, shader);
  }
  gl.bindAttribLocation(program, 0, 'aPos');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'program');
  }
  return program;
}

function texture(gl: WebGLRenderingContext, filter: number = gl.LINEAR): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  return tex;
}

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

  let bake: WebGLProgram, trace: WebGLProgram, draw: WebGLProgram;
  try {
    bake = compile(gl, BAKE);
    trace = compile(gl, TRACE);
    draw = compile(gl, DRAW);
  } catch {
    // Sin WebGL utilizable queda la grilla de puntos en CSS y el texto normal.
    return () => {};
  }

  // La escena aparece cuando termina el precálculo (sin fundido: entra por colapso); mientras,
  // la carga del hero.
  canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0`;
  container.append(canvas);
  // Sin animación, la escena va detrás del texto real: el contenido no depende de WebGL.
  if (reducedMotion) container.style.zIndex = '-1';

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const cellsTex = texture(gl, gl.NEAREST);
  const framebuffer = gl.createFramebuffer();
  const textTex = texture(gl);
  const textCanvas = document.createElement('canvas');

  const palette = readPalette().map((rgb) => rgb.map((v) => v / 255));
  // Las ubicaciones de los uniforms no cambian: se buscan una vez y no en cada cuadro.
  const locations = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
  const loc = (program: WebGLProgram, name: string) => {
    let byName = locations.get(program);
    if (!byName) locations.set(program, (byName = new Map()));
    if (!byName.has(name)) byName.set(name, gl.getUniformLocation(program, name));
    return byName.get(name) ?? null;
  };
  for (const program of [trace, draw]) {
    gl.useProgram(program);
    palette.forEach((rgb, i) => gl.uniform3fv(loc(program, `uC${i + 1}`), rgb));
  }

  // Tabla de trayectorias: unos 2 texels por celda de la pantalla, entre 128 y 512 por lado.
  // Está en radios de Schwarzschild, así que sirve para cualquier tamaño de pantalla.
  const lutSize = Math.min(
    512,
    Math.max(
      128,
      Math.round((80 * pxPerRsFor(container.clientWidth, container.clientHeight)) / CELL),
    ),
  );
  const lut = Array.from({ length: LUT_TEXTURES }, () => {
    const tex = texture(gl, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lutSize, lutSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb };
  });
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(trace);
  lut.forEach((_, i) => gl.uniform1i(loc(trace, `uLut${i}`), 2 + i));

  let width = 1,
    height = 1,
    cols = 1,
    rows = 1,
    dpr = 1,
    pxPerRs = 1;

  const uploadText = () => {
    drawText(section, textCanvas, dpr);
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
  };

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    if (!width || !height) return;
    dpr = canvasDpr();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
    pxPerRs = pxPerRsFor(width, height);
    section.style.setProperty('--hole-px', String(pxPerRs));
    gl.bindTexture(gl.TEXTURE_2D, cellsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cellsTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    ready = true;
    if (!baked) return;
    // El texto se redibuja en el mismo instante del cambio de tamaño, para que la textura
    // calce siempre con el texto real. Nada se dibuja antes de tenerlo: el nombre nunca desaparece.
    if (!reducedMotion) uploadText();
    if (reducedMotion || !running) render();
    play();
  };
  // Al terminar de cargar una fuente cambian las letras aunque no cambie el tamaño.
  const onFonts = () => {
    if (!ready || !baked || reducedMotion) return;
    uploadText();
    if (reducedMotion || !running) render();
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
    shared.px = pxPerRs;
    shared.time = time;
    shared.ready = true;

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, cols, rows);
    gl.useProgram(trace);
    lut.forEach(({ tex }, i) => {
      gl.activeTexture(gl.TEXTURE2 + i);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    });
    gl.uniform2fv(loc(trace, 'uHole'), hole);
    gl.uniform1f(loc(trace, 'uPx'), pxPerRs);
    gl.uniform1f(loc(trace, 'uTime'), time);
    gl.uniform1f(loc(trace, 'uInt'), INTENSITY);
    gl.uniform1f(loc(trace, 'uCell'), CELL);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(draw);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cellsTex);
    gl.uniform1i(loc(draw, 'uCells'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.uniform1i(loc(draw, 'uText'), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform2f(loc(draw, 'uGrid'), cols, rows);
    gl.uniform2f(loc(draw, 'uRes'), width, height);
    gl.uniform2fv(loc(draw, 'uHole'), hole);
    gl.uniform1f(loc(draw, 'uCell'), CELL);
    gl.uniform1f(loc(draw, 'uDpr'), dpr);
    gl.uniform1f(loc(draw, 'uPx'), pxPerRs);
    gl.uniform1f(loc(draw, 'uLens'), reducedMotion ? 0 : 1);
    const [cover, coverOnly, edgeKeep] = collapse(hole);
    gl.uniform1f(loc(draw, 'uCover'), cover);
    gl.uniform1f(loc(draw, 'uCoverOnly'), coverOnly);
    gl.uniform1f(loc(draw, 'uEdgeKeep'), edgeKeep);
    gl.uniform1f(loc(draw, 'uEdge'), COLLAPSE_EDGE);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
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

  let frame = 0,
    last = 0,
    visible = true,
    running = false,
    ready = false,
    baked = false;
  const loop = (now: number) => {
    time += Math.min(0.05, (now - last) / 1000) * SPEED;
    last = now;
    render();
    frame = requestAnimationFrame(loop);
  };
  const play = () => {
    if (running || reducedMotion || !visible || !ready || !baked) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    running = false;
  };

  // Precálculo repartido entre cuadros: cada trabajo es una franja de una textura de la tabla.
  // `--hole-progress` (0..1) mueve la animación de carga del hero.
  const strip = Math.ceil(lutSize / LUT_STRIPS);
  const jobs = Array.from({ length: LUT_TEXTURES * LUT_STRIPS }, (_, i) => ({
    out: Math.floor(i / LUT_STRIPS),
    y: (i % LUT_STRIPS) * strip,
  }));
  let done = 0,
    bakeFrame = 0;
  const bakeStart = performance.now();
  gl.useProgram(bake);
  gl.uniform1f(loc(bake, 'uSize'), lutSize);
  gl.uniform1f(loc(bake, 'uDoppler'), DOPPLER);
  section.classList.add('is-loading');
  section.style.setProperty(
    '--hole-px',
    String(pxPerRsFor(container.clientWidth, container.clientHeight)),
  );

  const reveal = () => {
    performance.measure('black-hole:bake', { start: bakeStart });
    gl.deleteProgram(bake);
    lut.forEach(({ fb }) => gl.deleteFramebuffer(fb));
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

  const bakeStep = () => {
    const start = performance.now();
    gl.useProgram(bake);
    gl.viewport(0, 0, lutSize, lutSize);
    gl.enable(gl.SCISSOR_TEST);
    const limit = Math.min(jobs.length, done + BAKE_MAX_JOBS);
    do {
      const { out, y } = jobs[done++];
      gl.bindFramebuffer(gl.FRAMEBUFFER, lut[out].fb);
      gl.scissor(0, y, lutSize, strip);
      gl.uniform1f(loc(bake, 'uOut'), out);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Espera a la GPU para medir de verdad cuánto costó y no pasarse del presupuesto.
      gl.finish();
    } while (done < limit && performance.now() - start < BAKE_BUDGET_MS);
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    section.style.setProperty('--hole-progress', String(done / jobs.length));
    if (done < jobs.length) bakeFrame = requestAnimationFrame(bakeStep);
    else reveal();
  };
  bakeFrame = requestAnimationFrame(bakeStep);

  // El hero queda pegado arriba mientras la hoja del portafolio lo tapa (decisión 014): se ve
  // mientras el borde de la hoja ([data-hero-end]) no haya pasado arriba de la pantalla.
  const end = document.querySelector<HTMLElement>('[data-hero-end]');
  const io = new IntersectionObserver(([entry]) => {
    visible = end ? entry.isIntersecting || entry.boundingClientRect.top > 0 : entry.isIntersecting;
    if (visible) play();
    else pause();
  });
  const ro = new ResizeObserver(resize);
  io.observe(end ?? section);
  ro.observe(container);

  return () => {
    pause();
    cancelAnimationFrame(bakeFrame);
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

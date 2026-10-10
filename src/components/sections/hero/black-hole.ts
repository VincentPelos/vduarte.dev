/**
 * Agujero negro del hero: trazado de rayos real dibujado con puntos de terminal.
 *
 * - Pasada 1 (una celda = un píxel): traza el rayo de luz del centro de cada celda por el
 *   espacio curvo (Schwarzschild, aceleración de Binet a = -3/2·h²·x/r⁵, en radios de
 *   Schwarzschild) y decide el punto de esa celda: estrella del cielo doblado o disco.
 * - Pasada 2 (pantalla): dibuja cada celda como un punto y encima el texto del hero, que
 *   resiste la gravedad: solo se comba y se separa en colores (aberración cromática).
 *
 * Interfaz intercambiable: `mount(section, scene, options) → unmount`.
 */

import { hole as shared } from '../../../lib/hole';
import { CELL, canvasDpr, readPalette } from '../../../lib/scene';

interface Options {
  /** Con `prefers-reduced-motion` se dibuja un solo cuadro, sin animar. */
  reducedMotion: boolean;
}

// Valores elegidos por el autor en el laboratorio.
const SPEED = 0.65;
const SCALE = 1.6;
const INTENSITY = 1;
const DOPPLER = 1;

const VERTEX = `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0., 1.); }
`;

const COMMON = `
  precision highp float;
  uniform vec3 uC1, uC2, uC3;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 pal(float k) { k = clamp(k, 0., 1.); return k < .5 ? mix(uC1, uC2, k * 2.) : mix(uC2, uC3, k * 2. - 1.); }
`;

const TRACE = `
  ${COMMON}
  uniform vec2 uHole;
  uniform float uPx, uTime, uInt, uDoppler, uCell;
  const float D = 32.;    // distancia del observador
  const float RIN = 3.;   // órbita estable más interna (ISCO)
  const float ROUT = 13.;
  const float TILT = .1, ROLL = -.12;

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), w = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), w.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), w.x), w.y);
  }

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
    mat2 rot = mat2(cr, -sr, sr, cr), inv = mat2(cr, sr, -sr, cr);
    vec2 rel = rot * (cc - uHole) / uPx;
    float b = length(rel);
    if (b > 20.) { gl_FragColor = sky(cc); return; }

    vec3 pos = vec3(0., 0., -D), vel = normalize(vec3(rel / D, 1.));
    vec3 hv = cross(pos, vel); float h2 = dot(hv, hv);
    vec3 N = vec3(0., cos(TILT), -sin(TILT));        // normal del disco, casi de canto
    vec3 ex = vec3(1., 0., 0.), ez = normalize(cross(ex, N));
    vec3 emit = vec3(0.); float trans = 1.; bool captured = false;
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
          float om = pow(rh, -1.5) * 1.8 * uTime;    // giro kepleriano: más rápido adentro
          vec2 q = vec2(dot(hit, ex), dot(hit, ez));
          q = mat2(cos(om), -sin(om), sin(om), cos(om)) * q;
          float gas = .55 * noise(q * 1.3) + .45 * noise(vec2(rh * 3.2, 0.) + q * .4);
          // temperatura del disco delgado (Novikov-Thorne simplificado), máximo ~1
          float T = pow(RIN / rh, .75) * pow(max(1. - sqrt(RIN / rh), 0.), .25) / .488;
          // Doppler + corrimiento gravitatorio: el lado que se acerca brilla mucho más
          float beta = sqrt(.5 / (rh - 1.)) * uDoppler;
          vec3 k = -normalize(vel);
          float g = mix(1., sqrt(1. - 1. / rh), uDoppler) / ((1. / sqrt(1. - beta * beta)) * (1. - beta * dot(normalize(cross(N, hit)), k)));
          float I = pow(T, 4.) * pow(g, 4.) * (.35 + 1.1 * gas);
          vec3 c = mix(pal(clamp(T * g * .9, 0., 1.)), vec3(1.), smoothstep(1.1, 1.8, T * g) * .6);
          float a = clamp(.35 + .8 * gas, 0., 1.) * smoothstep(RIN, RIN + .7, rh) * smoothstep(ROUT, ROUT - 5., rh);
          emit += trans * a * c * I * 2.2;
          trans *= 1. - a * .8;
        }
      }
      if (r2 < 1.) { captured = true; break; }
      if (r > D + 4. && dot(pos, vel) > 0.) break;
    }

    // la sombra es negra sólida (celda completa), para que nada de la página se vea a través
    vec4 s = vec4(0., 0., 0., 1.);
    if (!captured) {
      vec3 d = normalize(vel);
      vec2 look = d.z > .05 ? d.xy / d.z * D : rel * 1e3;   // a dónde apunta el rayo doblado
      vec2 lp = inv * mix(rel, look, 1. - smoothstep(11., 19.5, b));
      s = sky(uHole + lp * uPx);
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
  uniform float uCell, uDpr, uPx;

  vec4 textAt(vec2 px) {
    vec2 uv = px / uRes;
    return (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) ? vec4(0.) : texture2D(uText, uv);
  }

  void main() {
    vec2 px = gl_FragCoord.xy / uDpr;
    vec2 cell = floor(px / uCell);
    vec4 c = texture2D(uCells, (cell + .5) / uGrid);
    float r = uCell * c.a;
    // Solo se pintan los puntos y las letras: el resto queda transparente y deja ver la página.
    vec3 col = c.rgb;
    float dotAlpha = smoothstep(r, r - .8, length(px - (cell + .5) * uCell)) * step(.001, c.a);

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

function texture(gl: WebGLRenderingContext): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
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
  section.classList.add('is-lensing');
}

export function mount(
  section: HTMLElement,
  container: HTMLElement,
  { reducedMotion }: Options,
): () => void {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', {
    antialias: false,
    premultipliedAlpha: false,
    alpha: true,
  });
  if (!gl) return () => {};

  let trace: WebGLProgram, draw: WebGLProgram;
  try {
    trace = compile(gl, TRACE);
    draw = compile(gl, DRAW);
  } catch {
    // Sin WebGL utilizable queda la grilla de puntos en CSS y el texto normal.
    return () => {};
  }

  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  container.append(canvas);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const cellsTex = texture(gl);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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
    pxPerRs = Math.max(8, Math.min(width, height) * 0.022) * SCALE;
    gl.bindTexture(gl.TEXTURE_2D, cellsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cellsTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // El texto se redibuja en el mismo instante del cambio de tamaño, para que la textura
    // calce siempre con el texto real. Nada se dibuja antes de tenerlo: el nombre nunca desaparece.
    uploadText();
    ready = true;
    if (reducedMotion || !running) render();
    play();
  };
  // Al terminar de cargar una fuente cambian las letras aunque no cambie el tamaño.
  const onFonts = () => {
    if (!ready) return;
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
    gl.uniform2fv(loc(trace, 'uHole'), hole);
    gl.uniform1f(loc(trace, 'uPx'), pxPerRs);
    gl.uniform1f(loc(trace, 'uTime'), time);
    gl.uniform1f(loc(trace, 'uInt'), INTENSITY);
    gl.uniform1f(loc(trace, 'uDoppler'), DOPPLER);
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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let frame = 0,
    last = 0,
    visible = true,
    running = false,
    ready = false;
  const loop = (now: number) => {
    time += Math.min(0.05, (now - last) / 1000) * SPEED;
    last = now;
    render();
    frame = requestAnimationFrame(loop);
  };
  const play = () => {
    if (running || reducedMotion || !visible || !ready) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    running = false;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else pause();
  });
  const ro = new ResizeObserver(resize);
  io.observe(section);
  ro.observe(container);
  resize();

  return () => {
    pause();
    io.disconnect();
    ro.disconnect();
    document.fonts?.removeEventListener('loadingdone', onFonts);
    section.classList.remove('is-lensing');
    shared.ready = false;
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

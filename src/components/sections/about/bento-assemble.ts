/**
 * Armado del bento (#133, decisión 021): al terminar la caída al agujero (decisión 018), sus
 * puntos salen de arriba, viajan en curva y dibujan cada tarjeta, que aparece cuando le llegan.
 * Una vez por visita. Valores del laboratorio: duración 100 %, puntos 20 %, desorden 100 %.
 * Empieza con `hero:land`, mientras el portafolio sube, y no al terminar de subir: así no hay
 * una pausa vacía entre la caída y el armado.
 *
 * - Nada depende de que termine: las tarjetas vuelven por temporizador aunque el cuadro se
 *   detenga, y si el aterrizaje no llega, a los SAFETY_MS.
 * - Sin caída (sin WebGL, movimiento reducido, o se llega por la nav) el bento ya está armado.
 */

import { CELL, canvasDpr, readPalette } from '../../../lib/scene';

const DURATION_MS = 1500;
/** Fracción de los puntos posibles que viajan (20 % en el laboratorio). */
const COUNT = 0.2;
/** Cuánto se abren las curvas y se desordena la salida (100 % en el laboratorio). */
const CHAOS = 1;
/** En celular viaja la mitad de los puntos. */
const MOBILE_FACTOR = 0.55;
/** Si el aterrizaje no llega, las tarjetas se muestran igual. */
const SAFETY_MS = 4000;

interface Particle {
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  tx: number;
  ty: number;
  delay: number;
  travel: number;
  color: string;
  size: number;
}

const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const easeOutExpo = (t: number) => 1 - Math.pow(2, -10 * t);

export function mountAssemble(section: HTMLElement): () => void {
  const canvas = section.querySelector<HTMLCanvasElement>('[data-bento-fx]');
  const ctx = canvas?.getContext('2d');
  const cards = [...section.querySelectorAll<HTMLElement>('[data-bento-card]')];
  if (!canvas || !ctx || !cards.length) return () => {};

  const style = getComputedStyle(document.documentElement);
  const fg = style.getPropertyValue('--color-fg').trim();
  const bg = style.getPropertyValue('--color-bg').trim();
  const palette = readPalette().map(([r, g, b]) => `rgb(${r} ${g} ${b})`);

  let done = false;
  let waiting = false;
  let frame = 0;
  const timers: number[] = [];

  const reset = () => {
    for (const id of timers) clearTimeout(id);
    timers.length = 0;
    cancelAnimationFrame(frame);
    for (const card of cards) card.style.opacity = '';
    canvas.classList.add('hidden');
    waiting = false;
  };

  // La caída empieza: el bento espera vacío a sus puntos.
  const onFall = () => {
    if (done || waiting) return;
    waiting = true;
    for (const card of cards) card.style.opacity = '0';
    timers.push(window.setTimeout(reset, SAFETY_MS));
  };

  /** `top`: scroll donde termina de subir el portafolio; todo se calcula para esa posición. */
  const play = (top: number) => {
    for (const id of timers) clearTimeout(id);
    timers.length = 0;
    const box = section.getBoundingClientRect();
    const boxTop = box.top + scrollY - top;
    const dpr = canvasDpr();
    canvas.classList.remove('hidden');
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    // El agujero queda arriba al centro de la pantalla, donde terminó la caída.
    const hole = { x: innerWidth / 2 - box.left, y: -boxTop + 18 };
    const density = COUNT * (innerWidth <= 460 ? MOBILE_FACTOR : 1);
    const particles: Particle[] = [];
    const reveals: { card: HTMLElement; at: number }[] = [];

    cards.forEach((card, ci) => {
      const r = card.getBoundingClientRect();
      const x0 = r.left - box.left;
      const y0 = r.top - box.top;
      const points: [number, number][] = [];
      // Borde de la tarjeta, celda por celda, y un relleno ralo donde va el contenido.
      for (let x = x0 + 12; x < x0 + r.width - 12; x += CELL)
        points.push([x, y0], [x, y0 + r.height]);
      for (let y = y0 + 12; y < y0 + r.height - 12; y += CELL)
        points.push([x0, y], [x0 + r.width, y]);
      for (let y = y0 + 18; y < y0 + r.height - 18; y += CELL)
        for (let x = x0 + 18; x < x0 + r.width - 18; x += CELL)
          if (hash(Math.round(x / CELL), Math.round(y / CELL)) < 0.05) points.push([x, y]);

      const distance = Math.hypot(x0 + r.width / 2 - hole.x, y0 - hole.y);
      const cardDelay = 40 + distance * 0.3;
      points
        .filter((_, i) => hash(i, ci) < density * 0.55)
        .forEach(([tx, ty], i) => {
          const angle = hash(i, ci + 9) * Math.PI * 2;
          const radius = 4 + hash(ci, i) * 26;
          const sx = hole.x + Math.cos(angle) * radius;
          const sy = hole.y + Math.sin(angle) * radius * 0.45;
          const side = tx < hole.x ? -1 : 1;
          const pick = hash(i, ci + 4);
          particles.push({
            sx,
            sy,
            cx: (sx + tx) / 2 + side * (60 + 140 * CHAOS) * hash(i, ci + 2),
            cy: (sy + ty) / 2 - 40 * CHAOS,
            tx,
            ty,
            delay: cardDelay + hash(i + 3, ci) * 260 * (0.3 + CHAOS),
            travel: DURATION_MS * (0.55 + 0.35 * hash(ci + 5, i)),
            color: pick < 0.3 ? (palette[Math.floor(hash(ci, i + 1) * 3)] ?? fg) : fg,
            size: pick < 0.08 ? 1.6 : 1.05,
          });
        });
      reveals.push({ card, at: cardDelay + DURATION_MS * 0.45 });
    });

    const total = Math.max(0, ...particles.map((p) => p.delay + p.travel)) + 450;
    // Las tarjetas aparecen por temporizador: si el cuadro se detiene, igual quedan visibles.
    for (const { card, at } of reveals)
      timers.push(
        window.setTimeout(() => {
          card.style.opacity = '';
          card.animate(
            [
              { opacity: 0, transform: 'translateY(6px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          );
        }, at),
      );
    timers.push(window.setTimeout(reset, total + 100));

    const start = performance.now();
    const step = (now: number) => {
      const t = now - start;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);
      // El agujero: una sombra con un anillo de puntos de la paleta que se cierra.
      const k = Math.max(0, 1 - t / 900);
      if (k > 0) {
        ctx.globalAlpha = k;
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, 26 * k + 4, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 48; i++) {
          const a = (i / 48) * Math.PI * 2 + t / 300;
          ctx.fillStyle = palette[i % 3] ?? fg;
          ctx.beginPath();
          ctx.arc(
            hole.x + Math.cos(a) * (30 * k + 6),
            hole.y + Math.sin(a) * (12 * k + 3),
            1.2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      const fade = t > total - 450 ? Math.max(0, (total - t) / 450) : 1;
      for (const p of particles) {
        const progress = Math.min(1, Math.max(0, (t - p.delay) / p.travel));
        if (progress <= 0) continue;
        const e = easeOutExpo(progress);
        const u = 1 - e;
        ctx.globalAlpha = (progress < 1 ? 0.9 : 0.7) * fade;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(
          u * u * p.sx + 2 * u * e * p.cx + e * e * p.tx,
          u * u * p.sy + 2 * u * e * p.cy + e * e * p.ty,
          p.size,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (t < total) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };

  // La caída terminó y el portafolio sube: se arma una sola vez por visita.
  const onLand = (event: Event) => {
    if (done || !waiting) return;
    done = true;
    play((event as CustomEvent<{ top: number }>).detail.top);
  };

  addEventListener('hero:fall', onFall);
  addEventListener('hero:land', onLand);
  return () => {
    reset();
    removeEventListener('hero:fall', onFall);
    removeEventListener('hero:land', onLand);
  };
}

/**
 * Caída al agujero negro al pasar del hero al portafolio (decisión 018, variante C del laboratorio).
 *
 * Arriba de todo, el primer gesto hacia abajo (rueda, deslizar, ↓, Av Pág, espacio o la flecha
 * del hero) no hace scroll: dispara la caída, la cámara se acerca al agujero en 1 s hasta que la
 * sombra llena la pantalla, y recién ahí el portafolio sube. Al volver arriba, la cámara retrocede.
 *
 * - Cualquier otro scroll (barra, nav, anclas) sigue funcionando: la caída acompaña al scroll.
 * - Sin escena (sin WebGL o por software) no intercepta nada.
 * - No se monta con `prefers-reduced-motion` (Hero.astro).
 */

import { clamp01, fall, FALL_MS, RISE_MS, textOpacity } from '../../../lib/fall';
import { hole } from '../../../lib/hole';
import { smooth } from '../../../lib/smooth';

/** Píxeles de tolerancia para considerar que la página está arriba de todo. */
const TOP = 2;
/** Deslizamiento mínimo (px) para tomar un toque como gesto hacia abajo. */
const SWIPE = 12;
const DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' ']);

export function mountFall(section: HTMLElement, end: HTMLElement): () => void {
  let auto = 0; // avance de la caída automática
  let frame = 0;
  let busy = false;

  const apply = () => {
    // La caída acompaña también al scroll normal: así la barra o la nav nunca dejan el hero a medias.
    const p = Math.max(auto, clamp01(scrollY / innerHeight));
    fall.progress = p;
    section.style.setProperty('--fall-text', String(textOpacity(p)));
    section.style.setProperty('--fall-cue', String(clamp01(1 - Math.max(scrollY / 80, p * 4))));
  };

  const animate = (to: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(frame);
    const from = auto;
    const start = performance.now();
    const duration = ms * Math.abs(to - from);
    const step = (now: number) => {
      const x = duration ? clamp01((now - start) / duration) : 1;
      auto = from + (to - from) * x;
      apply();
      if (x < 1) frame = requestAnimationFrame(step);
      else done?.();
    };
    frame = requestAnimationFrame(step);
  };

  const atTop = () => scrollY <= TOP;
  // Solo con la escena montada y arriba de todo; mientras cae, se ignora el resto de gestos.
  const canFall = () => hole.ready && atTop() && auto < 1;

  const land = (focus: boolean) => {
    const top = end.getBoundingClientRect().top + scrollY;
    const finish = () => {
      busy = false;
      if (!focus) return;
      const target = document.getElementById('sobre-mi');
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    const lenis = smooth.lenis;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(top, { onComplete: finish });
    } else {
      scrollTo({ top, behavior: 'smooth' });
      setTimeout(finish, 900);
    }
  };

  const jump = (focus = false) => {
    busy = true;
    smooth.lenis?.stop();
    animate(1, FALL_MS, () => land(focus));
  };

  // Intenciones de bajar estando arriba. Se escuchan en captura para adelantarse a Lenis.
  const onWheel = (event: WheelEvent) => {
    if (busy && atTop()) return event.preventDefault();
    if (event.deltaY <= 0 || event.ctrlKey || !canFall()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    jump();
  };
  let touchY = 0;
  const onTouchStart = (event: TouchEvent) => (touchY = event.touches[0]?.clientY ?? 0);
  const onTouchMove = (event: TouchEvent) => {
    if (busy && atTop()) return event.preventDefault();
    const y = event.touches[0]?.clientY ?? touchY;
    if (touchY - y < SWIPE || !canFall()) return;
    event.preventDefault();
    jump();
  };
  const onKey = (event: KeyboardEvent) => {
    if (!DOWN_KEYS.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as Element | null;
    // El espacio en un botón o enlace lo activa: no se toma como scroll.
    if (target?.closest('input, textarea, select, button, a, [contenteditable]')) return;
    if (busy && atTop()) return event.preventDefault();
    if (!canFall()) return;
    event.preventDefault();
    jump(true);
  };
  const onCue = (event: MouseEvent) => {
    if (!(event.target as Element | null)?.closest('[data-fall-cue]')) return;
    if (busy) return event.preventDefault();
    if (!canFall()) return;
    event.preventDefault();
    event.stopPropagation();
    jump(event.detail === 0);
  };
  // De vuelta arriba (por cualquier vía), la cámara retrocede.
  const onScroll = () => {
    apply();
    if (!busy && atTop() && auto > 0) animate(0, RISE_MS);
  };

  addEventListener('wheel', onWheel, { capture: true, passive: false });
  addEventListener('touchstart', onTouchStart, { passive: true });
  addEventListener('touchmove', onTouchMove, { passive: false });
  addEventListener('keydown', onKey);
  document.addEventListener('click', onCue, { capture: true });
  addEventListener('scroll', onScroll, { passive: true });
  apply();

  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('wheel', onWheel, { capture: true });
    removeEventListener('touchstart', onTouchStart);
    removeEventListener('touchmove', onTouchMove);
    removeEventListener('keydown', onKey);
    document.removeEventListener('click', onCue, { capture: true });
    removeEventListener('scroll', onScroll);
    fall.progress = 0;
    smooth.lenis?.start();
  };
}

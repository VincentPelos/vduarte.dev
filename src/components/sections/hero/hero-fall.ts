/**
 * Caída al agujero negro al pasar del hero al portafolio (decisión 018, variante C del laboratorio).
 *
 * Arriba de todo, el primer gesto hacia abajo (rueda, deslizar, ↓, Av Pág, espacio o la flecha
 * del hero) no hace scroll: dispara la caída, la cámara se acerca al agujero en 1 s hasta que la
 * sombra llena la pantalla, y recién ahí el portafolio sube. Al subir, la cámara retrocede con el
 * scroll: cuando la hoja termina de bajar, el hero está como al principio.
 *
 * - Cualquier otro scroll (barra, nav, anclas) sigue funcionando: la caída acompaña al scroll.
 * - Nada depende de que el scroll suave termine: si el aterrizaje se interrumpe arriba de todo,
 *   la cámara retrocede sola, y cualquier gesto hacia arriba la hace retroceder.
 * - Avisa con eventos en `window`: `hero:fall` al empezar la caída, `hero:land` cuando la caída
 *   termina y el portafolio empieza a subir (con el scroll de destino en `detail.top`) y
 *   `hero:landed` al llegar. El bento se arma con los dos primeros (bento-assemble.ts, #133).
 * - Sin escena (sin WebGL o por software) no intercepta nada.
 * - No se monta con `prefers-reduced-motion` (Hero.astro).
 */

import { clamp01, fall, FALL_MS, textOpacity } from '../../../lib/fall';
import { hole } from '../../../lib/hole';
import { frameLoop } from '../../../lib/scene';
import { smooth } from '../../../lib/smooth';

/** Píxeles de tolerancia para considerar que la página está arriba de todo. */
const TOP = 2;
/** Deslizamiento mínimo (px) para tomar un toque como gesto. */
const SWIPE = 12;
const DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' ']);
const UP_KEYS = new Set(['ArrowUp', 'PageUp', 'Home']);
/** Vuelta de la cámara estando arriba de todo (ms). */
const RISE_MS = 600;
/** Si tras este tiempo la página sigue arriba (el aterrizaje se interrumpió), la cámara vuelve. */
const LAND_TIMEOUT_MS = 1200;

export function mountFall(section: HTMLElement, end: HTMLElement): () => void {
  let auto = 0; // avance de la caída automática
  let tween = frameLoop(() => false);
  let falling = false; // solo durante el segundo de la caída
  let landTimer = 0;

  const apply = () => {
    // La caída acompaña también al scroll normal: así la barra o la nav nunca dejan el hero a medias.
    // Al cuadrado: con la hoja a medio bajar, la cámara ya retrocedió casi entera y el texto vuelve.
    const p = Math.max(auto, clamp01(scrollY / innerHeight) ** 2);
    fall.progress = p;
    section.style.setProperty('--fall-text', String(textOpacity(p)));
    section.style.setProperty('--fall-cue', String(clamp01(1 - Math.max(scrollY / 80, p * 4))));
  };

  const animate = (to: number, ms: number, done?: () => void) => {
    tween.stop();
    const from = auto;
    const start = performance.now();
    const duration = ms * Math.abs(to - from);
    tween = frameLoop((now) => {
      const x = duration ? clamp01((now - start) / duration) : 1;
      auto = from + (to - from) * x;
      apply();
      if (x < 1) return true;
      done?.();
      return false;
    });
    tween.start();
  };

  const atTop = () => scrollY <= TOP;
  const retreat = () => {
    if (!falling && auto > 0 && atTop()) animate(0, RISE_MS);
  };

  const land = (focus: boolean) => {
    falling = false;
    const top = end.getBoundingClientRect().top + scrollY;
    const toFocus = () => {
      const target = document.getElementById('sobre-mi');
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    const landed = () => {
      if (focus) toFocus();
      dispatchEvent(new Event('hero:landed'));
    };
    dispatchEvent(new CustomEvent('hero:land', { detail: { top } }));
    const lenis = smooth.lenis;
    if (lenis) lenis.scrollTo(top, { onComplete: landed });
    else {
      scrollTo({ top, behavior: 'smooth' });
      setTimeout(landed, 900);
    }
    clearTimeout(landTimer);
    landTimer = window.setTimeout(retreat, LAND_TIMEOUT_MS);
  };

  // Lenis no se pausa: `lenis.stop()` le pone `overflow: clip` a la página, la barra de scroll
  // desaparece y todo salta de lado. Los gestos durante la caída se bloquean aquí.
  const fallDown = (focus = false) => {
    if (falling) return;
    // Si ya cayó y el aterrizaje se interrumpió, solo baja.
    if (auto >= 1) return land(focus);
    falling = true;
    dispatchEvent(new Event('hero:fall'));
    animate(1, FALL_MS, () => land(focus));
  };
  /** Arriba de todo y con la escena montada, bajar dispara la caída. */
  const canFall = () => hole.ready && atTop();

  // Se escucha en captura para adelantarse a Lenis, que escucha la rueda en window.
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey) return;
    const block = () => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    if (falling) return block();
    if (event.deltaY > 0 && canFall()) {
      block();
      fallDown();
    } else if (event.deltaY < 0) retreat();
  };
  let touchY = 0;
  let touchUsed = false;
  const onTouchStart = (event: TouchEvent) => {
    touchY = event.touches[0]?.clientY ?? 0;
    touchUsed = false;
  };
  const onTouchMove = (event: TouchEvent) => {
    if (falling) return event.preventDefault();
    if (touchUsed) return;
    const dy = touchY - (event.touches[0]?.clientY ?? touchY);
    if (dy >= SWIPE && canFall()) {
      event.preventDefault();
      touchUsed = true;
      fallDown();
    } else if (dy <= -SWIPE) {
      touchUsed = true;
      retreat();
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as Element | null;
    // El espacio en un botón o enlace lo activa: no se toma como scroll.
    if (target?.closest('input, textarea, select, button, a, [contenteditable]')) return;
    if (UP_KEYS.has(event.key)) return retreat();
    if (!DOWN_KEYS.has(event.key)) return;
    if (falling) return event.preventDefault();
    if (!canFall()) return;
    event.preventDefault();
    fallDown(true);
  };
  const onCue = (event: MouseEvent) => {
    if (!(event.target as Element | null)?.closest('[data-fall-cue]')) return;
    if (falling) return event.preventDefault();
    if (!canFall()) return;
    event.preventDefault();
    event.stopPropagation();
    fallDown(event.detail === 0);
  };
  // Al subir (por cualquier vía) la caída deja de mandar y la cámara sigue al scroll: retrocede
  // mientras la hoja baja, sin quedar al fondo de la caída (#136).
  let lastY = scrollY;
  const onScroll = () => {
    if (!falling && auto > 0 && scrollY < lastY) {
      tween.stop();
      auto = 0;
    }
    lastY = scrollY;
    apply();
  };

  addEventListener('wheel', onWheel, { capture: true, passive: false });
  addEventListener('touchstart', onTouchStart, { passive: true });
  addEventListener('touchmove', onTouchMove, { passive: false });
  addEventListener('keydown', onKey);
  document.addEventListener('click', onCue, { capture: true });
  addEventListener('scroll', onScroll, { passive: true });
  apply();

  return () => {
    tween.stop();
    clearTimeout(landTimer);
    removeEventListener('wheel', onWheel, { capture: true });
    removeEventListener('touchstart', onTouchStart);
    removeEventListener('touchmove', onTouchMove);
    removeEventListener('keydown', onKey);
    document.removeEventListener('click', onCue, { capture: true });
    removeEventListener('scroll', onScroll);
    fall.progress = 0;
  };
}

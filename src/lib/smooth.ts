import type Lenis from 'lenis';

/**
 * Instancia de Lenis (SmoothScroll.astro), compartida para que otros scripts puedan pausar la
 * rueda o hacer scroll suave. `null` con movimiento reducido o antes de montarse.
 */
export const smooth: { lenis: Lenis | null } = { lenis: null };

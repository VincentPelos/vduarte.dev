/**
 * Posición del agujero negro del hero en la pantalla, compartida entre black-hole.ts (que la
 * escribe en cada cuadro) y la cinemática de estrellas (que hace escapar las estrellas del disco).
 */
export const hole = {
  /** Centro en px de la ventana. */
  x: 0,
  y: 0,
  /** Px por radio de Schwarzschild. */
  px: 0,
  /** Tiempo de la animación del agujero (s). */
  time: 0,
  /** `true` mientras el agujero negro está montado. */
  ready: false,
};

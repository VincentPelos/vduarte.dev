import { describe, expect, it } from 'vitest';
import { gasCells, rockCells } from './sky-matter';

describe('gasCells', () => {
  const cells = gasCells(1, 60, 30);

  it('deja celdas dentro de la nube con densidad entre 0 y 1', () => {
    expect(cells.length).toBeGreaterThan(0);
    for (const c of cells) {
      expect(c.x).toBeGreaterThanOrEqual(0);
      expect(c.x).toBeLessThan(60);
      expect(c.d).toBeGreaterThan(0);
      expect(c.d).toBeLessThanOrEqual(1);
    }
  });

  it('se apaga hacia el borde: las esquinas quedan vacías', () => {
    expect(cells.some((c) => c.x === 0 && c.y === 0)).toBe(false);
    expect(cells.some((c) => c.x === 59 && c.y === 29)).toBe(false);
  });

  it('es estable: la misma semilla da la misma nube', () => {
    expect(gasCells(1, 60, 30)).toEqual(cells);
  });
});

describe('rockCells', () => {
  it('llena un disco irregular dentro del radio', () => {
    const cells = rockCells(3, 4, 0);
    expect(cells.length).toBeGreaterThan(20);
    for (const c of cells) expect(Math.hypot(c.x, c.y)).toBeLessThanOrEqual(4 * 1.0 + 0.01);
  });

  it('recibe la luz de arriba a la izquierda (los cráteres oscurecen algunas celdas)', () => {
    const cells = rockCells(3, 4, 0);
    const mean = (list: typeof cells) => list.reduce((sum, c) => sum + c.light, 0) / list.length;
    const lit = cells.filter((c) => c.x < 0 && c.y < 0);
    const dark = cells.filter((c) => c.x > 0 && c.y > 0);
    expect(mean(lit)).toBeGreaterThan(mean(dark));
  });

  it('cambia de forma al girar', () => {
    expect(rockCells(3, 4, 1.2)).not.toEqual(rockCells(3, 4, 0));
  });
});

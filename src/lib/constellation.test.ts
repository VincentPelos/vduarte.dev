import { describe, expect, it } from 'vitest';
import { diskColor, evenly, palette, segment, smooth, type Rgb } from './constellation';

const colors: [Rgb, Rgb, Rgb] = [
  [0, 209, 193],
  [122, 92, 255],
  [255, 92, 168],
];

describe('segment', () => {
  it('no avanza en una página sin secciones con constelación', () => {
    expect(segment([], 400)).toEqual({ from: 0, to: 0, progress: 0 });
  });

  const centers = [0, 1000, 2000];

  it('ubica el scroll entre dos secciones', () => {
    expect(segment(centers, 500)).toEqual({ from: 0, to: 1, progress: 0.5 });
    expect(segment(centers, 1000)).toEqual({ from: 1, to: 2, progress: 0 });
  });

  it('se queda en la última sección al pasarla', () => {
    expect(segment(centers, 2600)).toEqual({ from: 2, to: 2, progress: 0 });
  });

  it('acota el progreso antes de la primera sección', () => {
    expect(segment(centers, -300).progress).toBe(0);
  });
});

describe('smooth', () => {
  it('va de 0 a 1 y acota la entrada', () => {
    expect(smooth(-1)).toBe(0);
    expect(smooth(0.5)).toBe(0.5);
    expect(smooth(2)).toBe(1);
  });
});

describe('palette', () => {
  it('devuelve los colores en los extremos y el centro', () => {
    expect(palette(colors, 0)).toEqual(colors[0]);
    expect(palette(colors, 0.5)).toEqual(colors[1]);
    expect(palette(colors, 1)).toEqual(colors[2]);
  });
});

describe('diskColor', () => {
  it('es más claro cerca del centro que en el borde', () => {
    const brightness = (c: Rgb) => c[0] + c[1] + c[2];
    expect(brightness(diskColor(colors, 4))).toBeGreaterThan(brightness(diskColor(colors, 12)));
  });
});

describe('evenly', () => {
  it('reparte parejo sin pasarse del máximo', () => {
    const list = Array.from({ length: 100 }, (_, i) => i);
    const picked = evenly(list, 10);
    expect(picked).toHaveLength(10);
    expect(picked[1] - picked[0]).toBe(10);
    expect(evenly(list, 200)).toHaveLength(100);
  });
});

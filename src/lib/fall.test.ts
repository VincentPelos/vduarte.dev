import { describe, expect, it } from 'vitest';
import { coverZoom, easeInOutCubic, fallZoom, SHADOW_RS, textOpacity } from './fall';

describe('easeInOutCubic', () => {
  it('parte en 0, pasa por la mitad y termina en 1', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });
});

describe('coverZoom', () => {
  it('agranda la sombra hasta la esquina más lejana', () => {
    const px = 20;
    const zoom = coverZoom([0, 0], 300, 400, px);
    expect((zoom - 0.5) * SHADOW_RS * px).toBeCloseTo(500);
  });

  it('nunca aleja la cámara', () => {
    expect(coverZoom([5, 5], 10, 10, 100)).toBe(1);
  });
});

describe('fallZoom', () => {
  it('va de 1× al zoom máximo', () => {
    expect(fallZoom(0, 30)).toBe(1);
    expect(fallZoom(1, 30)).toBeCloseTo(30);
  });

  it('a mitad de la caída está en la media geométrica', () => {
    expect(fallZoom(0.5, 36)).toBeCloseTo(6);
  });

  it('acota el avance', () => {
    expect(fallZoom(-1, 30)).toBe(1);
    expect(fallZoom(2, 30)).toBeCloseTo(30);
  });
});

describe('textOpacity', () => {
  it('el texto se ve entero al inicio y se apaga antes del final', () => {
    expect(textOpacity(0)).toBe(1);
    expect(textOpacity(0.6)).toBe(0);
    expect(textOpacity(0.25)).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { hexToRgb } from './scene';

describe('hexToRgb', () => {
  it('convierte un hex de 6 dígitos', () => {
    expect(hexToRgb('#00d1c1')).toEqual([0, 209, 193]);
    expect(hexToRgb('#7a5cff')).toEqual([122, 92, 255]);
  });

  it('tolera espacios y la falta de #', () => {
    expect(hexToRgb('  ff5ca8 ')).toEqual([255, 92, 168]);
  });
});

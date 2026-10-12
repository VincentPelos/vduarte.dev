import { describe, expect, it } from 'vitest';
import { hash, hexToRgb, isSoftwareRenderer } from './scene';

describe('hexToRgb', () => {
  it('convierte un hex de 6 dígitos', () => {
    expect(hexToRgb('#00d1c1')).toEqual([0, 209, 193]);
    expect(hexToRgb('#7a5cff')).toEqual([122, 92, 255]);
  });

  it('tolera espacios y la falta de #', () => {
    expect(hexToRgb('  ff5ca8 ')).toEqual([255, 92, 168]);
  });
});

describe('isSoftwareRenderer', () => {
  it('reconoce los renderers por software', () => {
    expect(
      isSoftwareRenderer('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)'),
    ).toBe(true);
    expect(isSoftwareRenderer('llvmpipe (LLVM 15.0.7, 256 bits)')).toBe(true);
    expect(isSoftwareRenderer('ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11)')).toBe(
      true,
    );
  });

  it('deja pasar las GPU reales', () => {
    expect(
      isSoftwareRenderer('ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)'),
    ).toBe(false);
    expect(isSoftwareRenderer('Apple M2')).toBe(false);
    expect(isSoftwareRenderer('Adreno (TM) 650')).toBe(false);
  });
});

describe('hash', () => {
  it('da siempre el mismo valor para la misma celda', () => {
    expect(hash(3, 7)).toBe(hash(3, 7));
    expect(hash(3, 7)).not.toBe(hash(7, 3));
  });

  it('queda en [0, 1) y se reparte parejo', () => {
    const values = Array.from({ length: 2000 }, (_, i) => hash(i, i * 3 + 1));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    expect(mean).toBeGreaterThan(0.45);
    expect(mean).toBeLessThan(0.55);
  });
});

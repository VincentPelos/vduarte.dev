import { describe, expect, it } from 'vitest';
import { hexToRgb, isSoftwareRenderer } from './scene';

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

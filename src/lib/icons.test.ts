import { describe, expect, it } from 'vitest';
import { iconSymbol } from './icons';

describe('iconSymbol', () => {
  it('entrega id, viewBox y tamaño a 1em de alto', () => {
    const icon = iconSymbol('simple-icons:python');
    expect(icon.id).toBe('icon-simple-icons-python');
    expect(icon.viewBox).toBe('0 0 24 24');
    expect(icon.height).toBe('1em');
    expect(icon.width).toBe('1em');
    expect(icon.body).toMatch(/^<path/);
  });

  it('falla con el nombre si el set o el ícono no existen', () => {
    expect(() => iconSymbol('lucide:home')).toThrow('"lucide:home"');
    expect(() => iconSymbol('simple-icons:no-existe')).toThrow('"simple-icons:no-existe"');
  });
});

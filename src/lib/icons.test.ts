import { describe, expect, it } from 'vitest';
import { renderIcon } from './icons';

describe('renderIcon', () => {
  it('genera un svg decorativo que hereda el color', () => {
    const svg = renderIcon('simple-icons:python');
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('fill="currentColor"');
    expect(svg).toContain('aria-hidden="true"');
  });

  it('acepta atributos extra', () => {
    expect(renderIcon('simple-icons:python', { class: 'size-4' })).toContain('class="size-4"');
  });

  it('falla con el nombre si el set o el ícono no existen', () => {
    expect(() => renderIcon('lucide:home')).toThrow('"lucide:home"');
    expect(() => renderIcon('simple-icons:no-existe')).toThrow('"simple-icons:no-existe"');
  });
});

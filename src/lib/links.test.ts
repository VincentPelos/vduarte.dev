import { describe, expect, it } from 'vitest';
import { linkAttrs } from './links';

describe('linkAttrs', () => {
  it('abre los enlaces externos en otra pestaña', () => {
    expect(linkAttrs('https://github.com/VincentPelos')).toEqual({
      target: '_blank',
      rel: 'noopener',
    });
  });

  it('deja igual anclas, rutas internas y mailto', () => {
    expect(linkAttrs('#contacto')).toEqual({});
    expect(linkAttrs('/proyectos/colchagua')).toEqual({});
    expect(linkAttrs('mailto:hola@vduarte.dev')).toEqual({});
  });
});

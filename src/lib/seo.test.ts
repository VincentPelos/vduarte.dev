import { describe, expect, it } from 'vitest';
import { sitemap } from './seo';

describe('sitemap', () => {
  it('lista cada ruta con la URL completa del sitio', () => {
    const xml = sitemap(new URL('https://vduarte.dev'), ['/', '/uso-de-ia/']);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://vduarte.dev/</loc>');
    expect(xml).toContain('<loc>https://vduarte.dev/uso-de-ia/</loc>');
  });
});

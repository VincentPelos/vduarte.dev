/** `sitemap.xml` con las rutas del sitio (#185), sin dependencias: son pocas y se conocen en el build. */
export function sitemap(site: URL, paths: string[]): string {
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

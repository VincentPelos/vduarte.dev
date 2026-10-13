import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sitemap } from '../lib/seo';

// Las rutas públicas: el home, /uso-de-ia y una página por caso de estudio (#185).
export const GET: APIRoute = async ({ site }) => {
  const cases = await getCollection('cases');
  const paths = ['/', '/uso-de-ia/', ...cases.map((entry) => `/proyectos/${entry.id}/`)];
  return new Response(sitemap(site!, paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

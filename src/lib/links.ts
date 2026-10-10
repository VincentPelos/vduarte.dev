/** `target` y `rel` de un enlace: los externos (http/https) abren en otra pestaña. */
export function linkAttrs(href: string): { target?: '_blank'; rel?: 'noopener' } {
  return /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener' } : {};
}

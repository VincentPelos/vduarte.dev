import { icons as simpleIcons } from '@iconify-json/simple-icons';
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils';

// Sets disponibles (decisión 007). Para sumar otro: instalar @iconify-json/<set> y agregarlo aquí.
const sets = { 'simple-icons': simpleIcons };

/**
 * SVG en línea de un ícono de Iconify (`"simple-icons:python"`), generado en el build.
 * Lanza si el set o el ícono no existen, para que el build falle con el nombre exacto.
 */
export function renderIcon(name: string, attributes: Record<string, string> = {}): string {
  const [prefix, iconName] = name.split(':');
  const set = sets[prefix as keyof typeof sets];
  if (!set || !iconName) throw new Error(`Set de íconos no disponible: "${name}"`);

  const data = getIconData(set, iconName);
  if (!data) throw new Error(`Ícono inexistente: "${name}"`);

  const { attributes: svgAttributes, body } = iconToSVG(data, { height: '1em' });
  return iconToHTML(body, {
    ...svgAttributes,
    fill: 'currentColor',
    'aria-hidden': 'true',
    ...attributes,
  });
}

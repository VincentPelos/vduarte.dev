import { icons as simpleIcons } from '@iconify-json/simple-icons';
import { getIconData, iconToSVG } from '@iconify/utils';

// Sets disponibles (decisión 007). Para sumar otro: instalar @iconify-json/<set> y agregarlo aquí.
const sets = { 'simple-icons': simpleIcons };

export interface IconSymbol {
  /** Id del `<symbol>` en el sprite (`icon-simple-icons-python`). */
  id: string;
  viewBox: string;
  /** Tamaño a 1em de alto, con el ancho proporcional. */
  width: string;
  height: string;
  /** Contenido SVG del ícono (paths). */
  body: string;
}

/**
 * Datos de un ícono de Iconify (`"simple-icons:python"`) para el sprite (decisión 010).
 * Lanza si el set o el ícono no existen, para que el build falle con el nombre exacto.
 */
export function iconSymbol(name: string): IconSymbol {
  const [prefix, iconName] = name.split(':');
  const set = sets[prefix as keyof typeof sets];
  if (!set || !iconName) throw new Error(`Set de íconos no disponible: "${name}"`);

  const data = getIconData(set, iconName);
  if (!data) throw new Error(`Ícono inexistente: "${name}"`);

  const { attributes, body } = iconToSVG(data, { height: '1em' });
  return {
    id: `icon-${prefix}-${iconName}`,
    viewBox: attributes.viewBox,
    width: attributes.width ?? '1em',
    height: attributes.height ?? '1em',
    body,
  };
}

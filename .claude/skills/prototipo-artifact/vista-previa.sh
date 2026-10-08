#!/bin/sh
# Prepara el build (dist/) para publicarlo como artifact de vista previa.
# Uso: pnpm build && sh .claude/skills/prototipo-artifact/vista-previa.sh <carpeta-salida>
#
# - El visor de artifacts reserva los nombres que empiezan con "_": _astro/ pasa a assets/.
# - Las rutas absolutas (/_astro/, /favicon) pasan a relativas.
# - El visor pinta su propio fondo y fuente en <body>: se fuerzan los del sitio.
# Al terminar lista los archivos que hay que pasar en `files` al publicar.
set -e

out="${1:?Indica la carpeta de salida}"
root="$(cd "$(dirname "$0")/../../.." && pwd)"

rm -rf "$out"
mkdir -p "$out/assets"
cp "$root/dist/index.html" "$root/dist/favicon.svg" "$out/"
cp "$root"/dist/_astro/* "$out/assets/"

sed -i 's#"/_astro/#"assets/#g; s#href="/favicon#href="favicon#g' "$out/index.html"
sed -i 's#url(/_astro/#url(#g' "$out"/assets/*.css
sed -i 's#</head>#<style>html{background:\#000!important;color-scheme:dark}body{background:transparent!important;color:\#ededed!important;font-family:var(--font-sans)!important;font-size:1rem!important;line-height:1.6!important;margin:0;padding:0}</style></head>#' "$out/index.html"

echo "Archivos para \`files\` (además de index.html):"
ls "$out/assets" | grep -v -E '\.(woff2?|ttf)$' | sed 's#^#  assets/#'

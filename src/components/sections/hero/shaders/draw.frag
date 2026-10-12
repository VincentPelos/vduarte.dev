// Pasada 2 (pantalla): cada celda como un punto y, encima, el texto del hero combado.
uniform sampler2D uCells, uText;
uniform vec2 uGrid, uRes, uHole;
uniform float uCell, uDpr, uPx, uLens, uTextFade;
// Colapso de entrada: radio de la sombra que cubre (px, < 0 = apagado), si fuera de ella
// todavía no se ve la escena (1 mientras crece) y qué fracción del borde de puntos queda.
uniform float uCover, uCoverOnly, uEdge, uEdgeKeep;

vec4 textAt(vec2 px) {
  vec2 uv = px / uRes;
  return (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) ? vec4(0.) : texture2D(uText, uv);
}

void main() {
  vec2 px = gl_FragCoord.xy / uDpr;
  vec2 cell = floor(px / uCell);
  vec4 c = texture2D(uCells, (cell + .5) / uGrid);
  if (uCover >= 0.) {
    // Celda entera o nada, con un borde de puntos de la paleta: sin fundidos grises.
    vec2 to = (cell + .5) * uCell - uHole;
    float d = length(to) + (hash(cell) - .5) * uCell * 5. * uEdge;
    if (d < uCover - uCell * 1.2) c = vec4(0., 0., 0., 1.);
    else if (d < uCover && hash(cell + 3.7) < uEdgeKeep) c = vec4(pal(atan(to.y, to.x) / 6.2832 + .5), .3);
    else if (uCoverOnly > .5) c = vec4(0.);
  }
  float r = uCell * c.a;
  // Solo se pintan los puntos y las letras: el resto queda transparente y deja ver la página.
  vec3 col = c.rgb;
  float dotAlpha = smoothstep(r, r - .8, length(px - (cell + .5) * uCell)) * step(.001, c.a);
  if (uLens < .5) { gl_FragColor = vec4(col, dotAlpha); return; }

  // las letras resisten: cerca del agujero se comban y cada canal se dobla distinto
  vec2 rel = (px - uHole) / uPx;
  float r2 = dot(rel, rel);
  vec3 ks = vec3(.8, 1., 1.22) * 6.5 * (1. - smoothstep(4., 10., sqrt(r2)));
  float textAlpha = 0.;
  for (int i = 0; i < 3; i++) {
    vec4 t = textAt(uHole + rel * (1. - ks[i] / (r2 + 5.)) * uPx);
    t.a *= uTextFade;
    col[i] = mix(dotAlpha > 0. ? col[i] : t[i], t[i], t.a);
    textAlpha = max(textAlpha, t.a);
  }
  gl_FragColor = vec4(col, max(dotAlpha, textAlpha));
}

// Pasada 1 (una celda = un píxel): lee la tabla y aplica lo que cambia con el tiempo.
uniform vec2 uHole;
uniform float uPx, uTime, uInt, uCell, uZoom;
uniform sampler2D uLut0, uLut1, uLut2, uLut3, uLut4, uLut5;

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), w = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), w.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), w.x), w.y);
}

float unpack16(vec2 v) { return (floor(v.x * 255. + .5) * 256. + floor(v.y * 255. + .5)) / 65535.; }

// Cielo de terminal: cada celda tiene un nivel 0..3 (como · • ●). Devuelve color y tamaño.
vec4 sky(vec2 look) {
  vec2 id = floor(look / uCell); float h = hash(id);
  float lv = h > .996 ? 3. : h > .987 ? 2. : h > .965 ? 1. : 0.;
  // Con zoom, una celda del cielo abarca varias de la pantalla: la estrella va solo en la de su
  // centro, así sigue siendo un punto que se aleja y no un bloque.
  vec2 off = abs(look - (id + .5) * uCell) * uZoom;
  if (max(off.x, off.y) > uCell * .5) lv = 0.;
  if (lv > 0. && hash(id + floor(uTime * 1.2 + h * 9.)) > .86) lv -= 1.;   // titileo por escalones
  float size = lv > 2.5 ? .36 : lv > 1.5 ? .26 : lv > .5 ? .17 : .09;
  vec3 c = lv > .5 ? mix(vec3(1.), pal(hash(id + 9.)), .45) * (lv > 2.5 ? 1. : lv > 1.5 ? .75 : .45) : vec3(.1);
  return vec4(c, size);
}

void main() {
  // centro de la celda, en px CSS, visto por la cámara (zoom alrededor del agujero)
  vec2 cc = uHole + (gl_FragCoord.xy * uCell - uHole) / uZoom;
  float cr = cos(ROLL), sr = sin(ROLL);
  mat2 rot = mat2(cr, -sr, sr, cr);
  vec2 rel = rot * (cc - uHole) / uPx;
  if (length(rel) > BMAX) { gl_FragColor = sky(cc); return; }

  vec2 uv = rel / (2. * BMAX) + .5;
  vec4 t4 = texture2D(uLut4, uv), t5 = texture2D(uLut5, uv);
  float n = floor(t5.b * 255. + .5);
  vec3 emit = vec3(0.); float trans = 1.;
  for (int i = 0; i < 3; i++) {
    if (float(i) >= n) break;
    vec4 tq = i == 0 ? texture2D(uLut1, uv) : i == 1 ? texture2D(uLut2, uv) : texture2D(uLut3, uv);
    float g = (i == 0 ? unpack16(t4.rg) : i == 1 ? unpack16(t4.ba) : unpack16(t5.rg)) * GMAX;
    vec2 q = (vec2(unpack16(tq.rg), unpack16(tq.ba)) - .5) * 2. * ROUT;
    float rh = length(q);
    float om = pow(rh, -1.5) * 1.8 * uTime;    // giro kepleriano: más rápido adentro
    q = mat2(cos(om), -sin(om), sin(om), cos(om)) * q;
    float gas = .55 * noise(q * 1.3) + .45 * noise(vec2(rh * 3.2, 0.) + q * .4);
    // temperatura del disco delgado (Novikov-Thorne simplificado), máximo ~1
    float T = pow(RIN / rh, .75) * pow(max(1. - sqrt(RIN / rh), 0.), .25) / .488;
    float I = pow(T, 4.) * pow(g, 4.) * (.35 + 1.1 * gas);
    vec3 c = mix(pal(clamp(T * g * .9, 0., 1.)), vec3(1.), smoothstep(1.1, 1.8, T * g) * .6);
    float a = clamp(.35 + .8 * gas, 0., 1.) * smoothstep(RIN, RIN + .7, rh) * smoothstep(ROUT, ROUT - 5., rh);
    emit += trans * a * c * I * 2.2;
    trans *= 1. - a * .8;
  }

  // la sombra es negra sólida (celda completa), para que nada de la página se vea a través
  vec4 s = vec4(0., 0., 0., 1.);
  if (t5.a < .5) {
    vec4 tl = texture2D(uLut0, uv);
    vec2 dv = vec2(unpack16(tl.rg), unpack16(tl.ba)) * 2. - 1.;
    s = sky(cc + sign(dv) * dv * dv * LP * uPx);
    s.rgb *= trans;
  }
  // disco en la grilla: el punto crece por escalones con el brillo
  vec3 e = 1. - exp(-emit * uInt);
  float lum = dot(e, vec3(.3, .59, .11));
  float lvl = floor(clamp(lum * 1.5, 0., 1.) * 4. + .3) / 4.;
  vec3 hue = e / max(max(e.r, max(e.g, e.b)), 1e-3);
  vec4 disk = lvl > .01 ? vec4(hue * min(1., .4 + lum * 1.5), .14 + .3 * lvl) : vec4(0.);
  gl_FragColor = disk.a * dot(disk.rgb, vec3(1.)) > s.a * dot(s.rgb, vec3(1.)) ? disk : s;
}

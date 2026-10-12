// Constantes y funciones compartidas por las tres pasadas (se antepone a cada una).
precision highp float;
uniform vec3 uC1, uC2, uC3;
const float RIN = 3.;   // órbita estable más interna (ISCO)
const float ROUT = 13.;
const float ROLL = -.12;
const float BMAX = 20.; // radio (en Rs) dentro del cual la luz se desvía; afuera, cielo recto
const float LP = 400.;  // desvío máximo guardado del cielo (±, en Rs)
const float GMAX = 2.;  // rango del factor Doppler guardado
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 pal(float k) { k = clamp(k, 0., 1.); return k < .5 ? mix(uC1, uC2, k * 2.) : mix(uC2, uC3, k * 2. - 1.); }

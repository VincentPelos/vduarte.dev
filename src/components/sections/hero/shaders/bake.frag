// Precálculo: un rayo por texel de la tabla. `uOut` elige qué datos escribe esta pasada.
uniform float uSize, uOut, uDoppler;
const float D = 32.;    // distancia del observador
const float TILT = .1;

// [0, 1] → dos bytes (16 bits) en dos canales.
vec2 pack16(float v) {
  float x = floor(clamp(v, 0., 1.) * 65535. + .5);
  float hi = floor(x / 256.);
  return vec2(hi, x - hi * 256.) / 255.;
}

void main() {
  vec2 rel = (gl_FragCoord.xy / uSize - .5) * 2. * BMAX;
  float b = length(rel);
  if (b > BMAX + .5) { gl_FragColor = vec4(0.); return; }
  float cr = cos(ROLL), sr = sin(ROLL);
  mat2 inv = mat2(cr, sr, -sr, cr);

  vec3 pos = vec3(0., 0., -D), vel = normalize(vec3(rel / D, 1.));
  vec3 hv = cross(pos, vel); float h2 = dot(hv, hv);
  vec3 N = vec3(0., cos(TILT), -sin(TILT));        // normal del disco, casi de canto
  vec3 ex = vec3(1., 0., 0.), ez = normalize(cross(ex, N));
  vec2 q0 = vec2(0.), q1 = vec2(0.), q2 = vec2(0.);
  float g0 = 0., g1 = 0., g2 = 0., n = 0.;
  bool captured = false;
  for (int i = 0; i < 220; i++) {
    float r2 = dot(pos, pos), r = sqrt(r2);
    float dt = clamp(.07 * r, .03, 1.1);
    vec3 prev = pos;
    vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
    pos += vel * dt;
    float s0 = dot(prev, N), s1 = dot(pos, N);
    if (s0 * s1 < 0.) {
      vec3 hit = mix(prev, pos, s0 / (s0 - s1));
      float rh = length(hit);
      if (rh > RIN && rh < ROUT) {
        vec2 q = vec2(dot(hit, ex), dot(hit, ez));
        // Doppler + corrimiento gravitatorio: el lado que se acerca brilla mucho más
        float beta = sqrt(.5 / (rh - 1.)) * uDoppler;
        vec3 k = -normalize(vel);
        float g = mix(1., sqrt(1. - 1. / rh), uDoppler) / ((1. / sqrt(1. - beta * beta)) * (1. - beta * dot(normalize(cross(N, hit)), k)));
        if (n < .5) { q0 = q; g0 = g; } else if (n < 1.5) { q1 = q; g1 = g; } else if (n < 2.5) { q2 = q; g2 = g; }
        n += 1.;
      }
    }
    if (r2 < 1.) { captured = true; break; }
    if (r > D + 4. && dot(pos, vel) > 0.) break;
  }

  // Cuánto se desvía la mirada respecto del cielo recto (en Rs, ya mezclado hacia el borde).
  // Se guarda el desvío y no la posición: lejos del agujero es chico y suave, y la tabla no
  // cambia qué estrella se ve. Raíz cuadrada: más precisión en los desvíos chicos.
  vec2 dv = vec2(0.);
  if (!captured) {
    vec3 d = normalize(vel);
    vec2 look = d.z > .05 ? d.xy / d.z * D : rel * 1e3;
    vec2 defl = inv * (mix(rel, look, 1. - smoothstep(11., 19.5, b)) - rel);
    dv = sign(defl) * sqrt(min(abs(defl) / LP, 1.));
  }

  vec2 qs = vec2(.5 / ROUT);
  if (uOut < .5) gl_FragColor = vec4(pack16(dv.x * .5 + .5), pack16(dv.y * .5 + .5));
  else if (uOut < 1.5) gl_FragColor = vec4(pack16(q0.x * qs.x + .5), pack16(q0.y * qs.y + .5));
  else if (uOut < 2.5) gl_FragColor = vec4(pack16(q1.x * qs.x + .5), pack16(q1.y * qs.y + .5));
  else if (uOut < 3.5) gl_FragColor = vec4(pack16(q2.x * qs.x + .5), pack16(q2.y * qs.y + .5));
  else if (uOut < 4.5) gl_FragColor = vec4(pack16(g0 / GMAX), pack16(g1 / GMAX));
  else gl_FragColor = vec4(pack16(g2 / GMAX), min(n, 3.) / 255., captured ? 1. : 0.);
}

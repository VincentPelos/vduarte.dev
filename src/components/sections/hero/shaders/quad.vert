// Triángulo que cubre la pantalla: cada pasada es un shader de fragmentos.
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0., 1.); }

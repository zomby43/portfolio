/**
 * dither.js — WebGL2 halftone dither background
 * Técnica: grilla de puntos circulares con radio proporcional a la intensidad
 * (igual al efecto de React Bits Dither, portado a vanilla JS)
 */

const VERT = /* glsl */`#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = /* glsl */`#version 300 es
precision mediump float;
out vec4 outColor;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_mouseActive;
uniform float u_mouseRadius;
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_speed;
uniform float u_pixelSize;   /* tamaño de cada celda en px (p.ej. 6.0)  */
uniform vec3  u_waveColor;
uniform vec3  u_bgColor;

void main() {
  /* ── Celda de la grilla ───────────────────────────────────── */
  vec2 cell       = floor(gl_FragCoord.xy / u_pixelSize);
  vec2 cellCenter = (cell + 0.5) * u_pixelSize;
  vec2 cellUV     = cellCenter / u_res;
  cellUV.y        = 1.0 - cellUV.y;           /* flip Y para que 0 = arriba */

  float t = u_time * u_speed;

  /* ── Ondas superpuestas (evaluadas en el centro de la celda) ─ */
  float w  = sin(cellUV.x * u_frequency        + t         ) * u_amplitude;
         w += sin(cellUV.x * u_frequency * 2.1  + t * 0.73  ) * u_amplitude * 0.40;
         w += cos(cellUV.y * u_frequency * 0.55 + t * 0.88  ) * u_amplitude * 0.26;
         w += sin((cellUV.x + cellUV.y) * u_frequency * 0.3 + t * 0.55) * u_amplitude * 0.14;

  float intensity = clamp(0.5 + w + cellUV.y * 0.15, 0.0, 1.0);

  /* ── Ripple del cursor ───────────────────────────────────────  */
  if (u_mouseActive > 0.5) {
    vec2  mUV = u_mouse / u_res;
    mUV.y     = 1.0 - mUV.y;
    float d   = length(cellUV - mUV);
    intensity = clamp(intensity + smoothstep(u_mouseRadius, 0.0, d) * 0.65, 0.0, 1.0);
  }

  /* ── Punto circular con radio proporcional a la intensidad ───  */
  float maxR  = u_pixelSize * 0.48;
  float dotR  = maxR * intensity;
  float dist  = length(gl_FragCoord.xy - cellCenter);

  /* Anti-aliasing de un píxel en el borde del círculo */
  float inDot = 1.0 - smoothstep(dotR - 0.8, dotR + 0.8, dist);

  outColor = vec4(mix(u_bgColor, u_waveColor, inDot), 1.0);
}`;

/* ─────────────────────────────────────────────────────────────
   initDither(container, options?)
   ───────────────────────────────────────────────────────────── */
export function initDither(container, options = {}) {
  const cfg = Object.assign({
    pixelSize:   7.0,                    /* tamaño de celda en px            */
    waveColor:   [0.973, 0.973, 0.949], /* #f8f8f2 — mismo que --fg         */
    bgColor:     [0.051, 0.055, 0.090], /* #0d0e17 — mismo que --bg         */
    amplitude:   0.42,
    frequency:   6.0,
    speed:       0.35,
    mouseRadius: 0.25,
    mouseFX:     true,
  }, options);

  const canvas = document.createElement('canvas');
  canvas.className = 'dither-canvas';
  container.prepend(canvas);

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    canvas.remove();
    console.warn('Dither: WebGL2 no disponible.');
    return null;
  }

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  const vert = compile(gl.VERTEX_SHADER,   VERT);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vert || !frag) { canvas.remove(); return null; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Link error:', gl.getProgramInfoLog(prog));
    canvas.remove();
    return null;
  }
  gl.useProgram(prog);

  /* Quad pantalla completa */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* Uniforms */
  const U = {};
  ['u_time','u_res','u_mouse','u_mouseActive','u_mouseRadius',
   'u_amplitude','u_frequency','u_speed','u_pixelSize',
   'u_waveColor','u_bgColor'].forEach(n => { U[n] = gl.getUniformLocation(prog, n); });

  gl.uniform1f(U.u_amplitude,   cfg.amplitude);
  gl.uniform1f(U.u_frequency,   cfg.frequency);
  gl.uniform1f(U.u_speed,       cfg.speed);
  gl.uniform1f(U.u_pixelSize,   cfg.pixelSize);
  gl.uniform1f(U.u_mouseRadius, cfg.mouseRadius);
  gl.uniform3fv(U.u_waveColor,  cfg.waveColor);
  gl.uniform3fv(U.u_bgColor,    cfg.bgColor);

  /* Mouse */
  let mx = 0, my = 0, mActive = 0;
  if (cfg.mouseFX) {
    container.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      mActive = 1;
    });
    container.addEventListener('mouseleave', () => { mActive = 0; });
  }

  /* Resize */
  function resize() {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.u_res, canvas.width, canvas.height);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* Loop */
  let rafId;
  function render(ts) {
    gl.uniform1f(U.u_time,        ts * 0.001);
    gl.uniform2f(U.u_mouse,       mx, my);
    gl.uniform1f(U.u_mouseActive, mActive);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafId = requestAnimationFrame(render);
  }
  rafId = requestAnimationFrame(render);

  return function destroy() {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    canvas.remove();
  };
}

/**
 * ascii.js — WebGL2 ASCII art background
 * Renderiza caracteres ordenados por densidad visual
 * según la intensidad de una ola animada.
 */

const VERT = /* glsl */`#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = /* glsl */`#version 300 es
precision mediump float;
out vec4 outColor;

uniform float     u_time;
uniform vec2      u_res;
uniform vec2      u_mouse;
uniform float     u_mouseActive;
uniform float     u_mouseRadius;
uniform float     u_amplitude;
uniform float     u_frequency;
uniform float     u_speed;
uniform float     u_cellW;
uniform float     u_cellH;
uniform int       u_charCount;
uniform vec3      u_fgColor;
uniform vec3      u_bgColor;
uniform sampler2D u_font;

void main() {
  /* ── Celda ─────────────────────────────────────────────────── */
  vec2 cellSize   = vec2(u_cellW, u_cellH);
  vec2 cell       = floor(gl_FragCoord.xy / cellSize);
  vec2 cellOrigin = cell * cellSize;
  vec2 cellCenter = cellOrigin + cellSize * 0.5;
  vec2 cellUV     = cellCenter / u_res;
  cellUV.y        = 1.0 - cellUV.y;

  /* UV local dentro de la celda [0,1]² */
  vec2 localUV    = (gl_FragCoord.xy - cellOrigin) / cellSize;
  localUV.y       = 1.0 - localUV.y;   /* flip para coords de textura */

  /* ── Ondas ──────────────────────────────────────────────────── */
  float t = u_time * u_speed;
  float w  = sin(cellUV.x * u_frequency         + t        ) * u_amplitude;
         w += sin(cellUV.x * u_frequency * 2.1   + t * 0.73 ) * u_amplitude * 0.40;
         w += cos(cellUV.y * u_frequency * 0.55  + t * 0.88 ) * u_amplitude * 0.26;
         w += sin((cellUV.x + cellUV.y) * u_frequency * 0.3 + t * 0.55) * u_amplitude * 0.14;

  float intensity = clamp(0.5 + w, 0.0, 1.0);

  /* ── Ripple del cursor ──────────────────────────────────────── */
  if (u_mouseActive > 0.5) {
    vec2  mUV = u_mouse / u_res;
    /* cellUV.y ya está en coords de pantalla (0=top), mUV.y también — no flipear */
    float d   = length(cellUV - mUV);
    intensity = clamp(intensity + smoothstep(u_mouseRadius, 0.0, d) * 0.55, 0.0, 1.0);
  }

  /* ── Seleccionar carácter por intensidad ────────────────────── */
  float n   = float(u_charCount);
  float idx = clamp(floor(intensity * n), 0.0, n - 1.0);

  /* ── Samplear atlas de fuente ───────────────────────────────── */
  float cw     = 1.0 / n;
  vec2  fontUV = vec2((idx + localUV.x) * cw, localUV.y);
  float glyph  = texture(u_font, fontUV).r;

  outColor = vec4(mix(u_bgColor, u_fgColor, glyph), 1.0);
}`;

/* ─────────────────────────────────────────────────────────────
   buildFontTexture
   Renderiza los caracteres en un canvas 2D y los sube como textura.
   chars[] debe estar ordenado de menor a mayor densidad visual.
   ───────────────────────────────────────────────────────────── */
function buildFontTexture(gl, chars, cellW, cellH, fontFamily) {
  const n   = chars.length;
  const cvs = document.createElement('canvas');
  cvs.width  = cellW * n;
  cvs.height = cellH;
  const ctx  = cvs.getContext('2d');

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  ctx.fillStyle    = '#fff';
  ctx.font         = `${cellH}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.textAlign    = 'left';

  for (let i = 0; i < n; i++) {
    ctx.fillText(chars[i], i * cellW, 0);
  }

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return { tex, charCount: n };
}

/* ─────────────────────────────────────────────────────────────
   initAscii(container, options?)
   ───────────────────────────────────────────────────────────── */
export function initAscii(container, options = {}) {
  /* Caracteres ordenados de vacío → denso */
  const chars      = (options.chars || ' .,:;i1|ltfxo*#@').split('');
  const cellH      = options.cellH      || 14;
  const cellW      = options.cellW      || 8;
  const fontFamily = options.fontFamily || '"Courier New", monospace';

  const cfg = Object.assign({
    fgColor:     [1.0, 0.475, 0.776],      /* --accent  #ff79c6 */
    bgColor:     [0.051, 0.055, 0.090],   /* --bg      #0d0e17 */
    amplitude:   0.42,
    frequency:   5.5,
    speed:       0.30,
    mouseRadius: 0.25,
    mouseFX:     true,
  }, options);

  /* Canvas WebGL */
  const canvas = document.createElement('canvas');
  canvas.className = 'dither-canvas';
  container.prepend(canvas);

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    canvas.remove();
    console.warn('ASCII: WebGL2 no disponible.');
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

  /* Textura de fuente */
  const { tex, charCount } = buildFontTexture(gl, chars, cellW, cellH, fontFamily);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);

  /* Uniforms */
  const U = {};
  ['u_time','u_res','u_mouse','u_mouseActive','u_mouseRadius',
   'u_amplitude','u_frequency','u_speed','u_cellW','u_cellH',
   'u_charCount','u_fgColor','u_bgColor','u_font'].forEach(n => {
    U[n] = gl.getUniformLocation(prog, n);
  });

  gl.uniform1i(U.u_font,        0);
  gl.uniform1i(U.u_charCount,   charCount);
  gl.uniform1f(U.u_amplitude,   cfg.amplitude);
  gl.uniform1f(U.u_frequency,   cfg.frequency);
  gl.uniform1f(U.u_speed,       cfg.speed);
  gl.uniform1f(U.u_cellW,       cellW);
  gl.uniform1f(U.u_cellH,       cellH);
  gl.uniform1f(U.u_mouseRadius, cfg.mouseRadius);
  gl.uniform3fv(U.u_fgColor,    cfg.fgColor);
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

  /* Resize — snapshot antes de tocar el canvas para evitar feedback loop */
  function resize() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (!w || !h || (canvas.width === w && canvas.height === h)) return;
    canvas.width  = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.u_res, w, h);
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

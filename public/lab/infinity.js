/* Original parametric infinity study. Decorative 3D, never runtime telemetry. */
"use strict";
(() => {
  const stage = document.querySelector("[data-infinity]");
  if (!stage) return;
  const canvas = stage.querySelector("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!gl) return;
  const vertexSource = `
    attribute vec3 a_position;
    attribute float a_progress;
    attribute float a_strand;
    uniform vec2 u_tilt;
    uniform float u_aspect;
    uniform float u_phase;
    uniform float u_step;
    varying vec4 v_color;
    void main() {
      vec3 p = a_position;
      float cx = cos(u_tilt.y), sx = sin(u_tilt.y);
      float cy = cos(u_tilt.x), sy = sin(u_tilt.x);
      p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
      p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
      float perspective = 3.6 / (3.6 - p.z);
      gl_Position = vec4(p.x * perspective / u_aspect, p.y * perspective, p.z * .15, 1.0);
      float pulse = exp(-pow(sin((a_progress - u_phase) * 3.14159265) * 15.0, 2.0));
      float selected = exp(-pow(sin((a_progress - u_step) * 3.14159265) * 9.0, 2.0));
      vec3 violet = mix(vec3(.42,.29,.68), vec3(.70,.53,.88), a_strand);
      vec3 cool = vec3(.43,.65,.73);
      vec3 base = mix(violet, cool, smoothstep(.45,.85,a_progress) * .5);
      float depth = clamp(.68 + p.z * .4, .28, 1.0);
      v_color = vec4(base + vec3(.2,.15,.23) * selected + vec3(.35,.3,.38) * pulse, (.20 + .32 * a_strand + pulse * .3 + selected * .14) * depth);
    }
  `;
  const fragmentSource = `precision mediump float; varying vec4 v_color; void main() { gl_FragColor = v_color; }`;
  function shader(type, source) {
    const value = gl.createShader(type);
    gl.shaderSource(value, source);
    gl.compileShader(value);
    if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
      gl.deleteShader(value);
      return null;
    }
    return value;
  }
  const vertex = shader(gl.VERTEX_SHADER, vertexSource),
    fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.useProgram(program);
  // A tube of fine filaments around a spatial lemniscate. Over/under depth is real.
  const strands = 34,
    segments = 400,
    vertices = [];
  const curve = (t) => [
    1.63 * Math.cos(t),
    0.65 * Math.sin(2 * t),
    0.3 * Math.sin(t),
  ];
  for (let s = 0; s < strands; s++) {
    const a = (s / strands) * Math.PI * 2;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const c = curve(t),
        before = curve(t - 0.002),
        after = curve(t + 0.002);
      const dx = after[0] - before[0],
        dy = after[1] - before[1];
      const length = Math.hypot(dx, dy);
      const width = 0.095 + 0.034 * Math.sin(3 * t + a * 0.3);
      vertices.push(
        c[0] - (dy / length) * Math.cos(a) * width,
        c[1] + (dx / length) * Math.cos(a) * width,
        c[2] + Math.sin(a) * width,
        i / segments,
        0.35 + (0.65 * (s % 5)) / 4,
      );
    }
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  for (const [name, size, offset] of [
    ["a_position", 3, 0],
    ["a_progress", 1, 12],
    ["a_strand", 1, 16],
  ]) {
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 20, offset);
  }
  const uniforms = Object.fromEntries(
    ["u_tilt", "u_aspect", "u_phase", "u_step"].map((n) => [
      n,
      gl.getUniformLocation(program, n),
    ]),
  );
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);
  let visible = false,
    frame = 0,
    last = 0,
    phase = 0.1,
    tiltX = -0.1,
    tiltY = 0.19,
    targetX = -0.1,
    targetY = 0.19,
    lost = false;
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = () =>
    visible &&
    !document.hidden &&
    !reduced.matches &&
    !root.classList.contains("motion-paused") &&
    !lost;
  function draw() {
    if (lost) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.6);
    const width = Math.round(stage.clientWidth * ratio),
      height = Math.round(stage.clientHeight * ratio);
    if (!width || !height) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.u_tilt, tiltX, tiltY);
    // Keep the complete object framed across wide and narrow viewports.
    gl.uniform1f(uniforms.u_aspect, Math.max(2.08, width / height));
    gl.uniform1f(uniforms.u_phase, phase);
    gl.uniform1f(uniforms.u_step, Number(stage.dataset.step) / 6);
    for (let s = 0; s < strands; s++)
      gl.drawArrays(gl.LINE_STRIP, s * (segments + 1), segments + 1);
    stage.classList.add("webgl-ready");
  }
  function tick(time) {
    frame = 0;
    if (!canAnimate()) {
      last = 0;
      return;
    }
    if (!last || time - last >= 32) {
      const delta = last ? Math.min(time - last, 100) : 32;
      phase = (phase + delta / 24000) % 1;
      tiltX += (targetX - tiltX) * 0.065;
      tiltY += (targetY - tiltY) * 0.065;
      draw();
      last = time;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (canAnimate()) {
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      draw();
    }
  }
  stage.addEventListener("pointermove", (event) => {
    if (!canAnimate() || event.pointerType !== "mouse") return;
    const box = stage.getBoundingClientRect();
    targetX = ((event.clientX - box.left) / box.width - 0.5) * 0.26 - 0.1;
    targetY = ((event.clientY - box.top) / box.height - 0.5) * -0.19 + 0.19;
  });
  stage.addEventListener("pointerleave", () => {
    targetX = -0.1;
    targetY = 0.19;
  });
  stage.addEventListener("stepchange", draw);
  const resize = new ResizeObserver(() => draw());
  resize.observe(stage);
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.05 },
  );
  intersection.observe(stage);
  const mutations = new MutationObserver(sync);
  mutations.observe(root, { attributes: true, attributeFilter: ["class"] });
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    stage.classList.remove("webgl-ready");
  });
  // On loss the complete vector fallback remains; avoid an automatic reload loop.
  draw();
})();

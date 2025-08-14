import React, { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() { gl_Position = a_position; }
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
#define TAU 6.28318530718
#define MAX_ITER 5

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Sample at pixel centers (stability)
    vec2 pixel = floor(fragCoord) + 0.5;
    vec2 uv = pixel / iResolution.xy;

    // Slow time = smoother motion on mobile
    float time = iTime * 0.03 + 23.0;

    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.005; // slight smoothing to reduce flicker

    for (int n = 0; n < MAX_ITER; n++) {
        float t = time * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y),
                     sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(
            p.x / (sin(i.x + t) / inten),
            p.y / (cos(i.y + t) / inten)
        ));
    }

    c /= float(MAX_ITER);
    c = 1.17 - pow(c, 1.4);

    vec3 colour = vec3(pow(abs(c), 4.0));
    colour = clamp(mix(colour, vec3(0.12, 0.18, 0.23), 0.18), 0.0, 1.0);
    fragColor = vec4(colour, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export default function ReflectBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Force it to live outside layout constraints
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      display: "block",
      zIndex: -1,
      // Let the browser smoothly upscale our low-res buffer
      imageRendering: "auto"
    });

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Ask for high-performance WebGL if available
    const gl =
      canvas.getContext("webgl", {
        antialias: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      }) || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // --- build program ---
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1,  1, 1, -1,  1, 1
      ]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");

    // ---- Resolution strategy: render LOWER than device pixels, upscale ----
    // This kills the shimmer from high-frequency fractal updates on mobile GPUs.
    const computeRenderSize = () => {
      const baseDPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
      // Heuristic: downscale internal render on mobile; desktop gets more pixels.
      const scale = isMobile ? 0.5 : 0.75; // 50% on mobile, 75% on desktop
      const dpr = baseDPR * scale;
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      return { w, h };
    };

    const resize = () => {
      const { w, h } = computeRenderSize();
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    // --- Frame pacing ---
    const targetFPS = isMobile ? 24 : 60;
    let last = 0;
    let rafId = 0;
    let start = performance.now();
    let scrolling = false;
    let scrollTimer = 0;
    let paused = document.hidden;

    const onScroll = () => {
      scrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      // Pause more aggressively on mobile during active scroll
      scrollTimer = setTimeout(() => (scrolling = false), 120);
    };

    const onVisibility = () => {
      paused = document.hidden;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const render = (t) => {
      // Skip frames to targetFPS
      if (t - last < 1000 / targetFPS || paused || scrolling) {
        rafId = requestAnimationFrame(render);
        return;
      }
      last = t;

      resize();

      const timeSec = (t - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeSec);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

import React, { useEffect, useMemo, useRef, useState } from "react";

/** === CONFIG YOU CAN TWEAK === */
const MOBILE_FALLBACK = true;       // try video on mobile by default
const LOWPOWER_FALLBACK = true;     // try video if GPU looks weak
const MOBILE_RENDER_SCALE = 0.5;    // internal WebGL scale on mobile (lower = safer)
const DESKTOP_RENDER_SCALE = 0.75;  // internal WebGL scale on desktop
const MOBILE_FPS = 24;              // cap FPS on mobile
const DESKTOP_FPS = 60;             // cap FPS on desktop

/** Provide your video files here (short seamless loop, 6–12s) */
const VIDEO_SOURCES = [
  { src: "/video/bg-loop.webm", type: "video/webm" },
  { src: "/video/bg-loop.mp4",  type: "video/mp4" },
];

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
    vec2 pixel = floor(fragCoord) + 0.5;              // stabilize sampling
    vec2 uv = pixel / iResolution.xy;
    float time = iTime * 0.03 + 23.0;                 // slow time
    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.005;                               // mild smoothing
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
void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

function isMobileUA() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** quick GPU capability sniff */
function looksLowPower(gl) {
  try {
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg && gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const highpGood = highp && highp.precision >= 20; // crude
    const badRenderer = renderer && /(mali|powervr|adreno 3|apple a10|a9|mt\d+)/i.test(renderer);
    return maxTex < 4096 || !highpGood || badRenderer;
  } catch { return true; }
}

export default function ReflectBackground() {
  const [useVideo, setUseVideo] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Allow manual override via URL: ?gl=1 (force WebGL), ?gl=0 (force video)
  const forcedMode = useMemo(() => {
    const m = new URLSearchParams(window.location.search).get("gl");
    return m === "1" ? "webgl" : m === "0" ? "video" : null;
  }, []);

  useEffect(() => {
    if (forcedMode === "video") { setUseVideo(true); return; }
    if (forcedMode === "webgl") { setUseVideo(false); return; }

    // Prefer video on mobile/weak GPUs
    if (MOBILE_FALLBACK && isMobileUA()) { setUseVideo(true); return; }

    // Probe WebGL quickly; if weak, fallback to video
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl", { antialias: false });
    if (!gl) { setUseVideo(true); return; }
    if (LOWPOWER_FALLBACK && looksLowPower(gl)) { setUseVideo(true); return; }

    setUseVideo(false);
  }, [forcedMode]);

  // VIDEO PATH — simple, stable, zero shimmer
  useEffect(() => {
    if (!useVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => v.play().catch(() => {});
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [useVideo]);

  // WEBGL PATH — reduced internal res, frame cap, pause during scroll/hidden
  useEffect(() => {
    if (useVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", {
        antialias: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      }) || canvas.getContext("experimental-webgl");
    if (!gl) { setUseVideo(true); return; }

    // Build program
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh)); return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) { setUseVideo(true); return; }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog)); setUseVideo(true); return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1,
      -1, 1, 1,-1,  1,1
    ]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");

    const isMobile = isMobileUA();
    const scale = isMobile ? MOBILE_RENDER_SCALE : DESKTOP_RENDER_SCALE;
    const targetFPS = isMobile ? MOBILE_FPS : DESKTOP_FPS;

    const resize = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3)) * scale;
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h; gl.viewport(0,0,w,h);
      }
    };

    let raf = 0, last = 0, start = performance.now();
    let scrolling = false, paused = document.hidden;
    let scrollTimer = 0;

    const onScroll = () => { scrolling = true; clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => (scrolling = false), 120); };
    const onVisibility = () => { paused = document.hidden; };
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const render = (t) => {
      if (paused || scrolling || t - last < 1000 / targetFPS) { raf = requestAnimationFrame(render); return; }
      last = t;
      resize();
      const timeSec = (t - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeSec);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [useVideo]);

  // Shared style: full-viewport, behind everything
  const baseStyle = {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    display: "block",
    zIndex: -1,
    objectFit: "cover",
    // We let the browser upscale smoothly; if you want sharp pixels, try "pixelated"
    imageRendering: "auto"
  };

  if (useVideo) {
    return (
      <video
        ref={videoRef}
        style={baseStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/bg-poster.jpg"  // optional placeholder
      >
        {VIDEO_SOURCES.map(s => (
          <source key={s.src} src={s.src} type={s.type}/>
        ))}
      </video>
    );
  }

  return <canvas ref={canvasRef} style={baseStyle} />;
}

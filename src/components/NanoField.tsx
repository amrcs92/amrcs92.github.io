"use client";

import { useEffect, useRef } from "react";

/* ---- Nano particles: tune here ------------------------------------------------
   density / mobileDensity  px² of viewport per particle (bigger = fewer particles)
   max / mobileMax          hard caps on particle count
   link                     max distance (px) for a connecting line; 0 = no lines
   radius                   cursor influence radius (px)
   force                    cursor push strength; mode "repel" or "attract"
   spring / damping         pull back home (higher = snappier) / velocity kept per frame
   drift / speed            idle wander amplitude (px) / idle wander speed
   Colours come from the theme tokens: --cn-muted (particles, lines), --cn-accent (near cursor). */
export const NANO = {
  density: 5200, mobileDensity: 7000, max: 280, mobileMax: 90, link: 90,
  radius: 200, force: 1.7, mode: "repel" as "repel" | "attract",
  spring: 0.035, damping: 0.86, drift: 4, speed: 1,
};

type Particle = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; ph: number; sp: number; h: number };

/** Fixed full-viewport canvas behind the whole page. Never takes pointer events; listens on the window. */
export function NanoField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    let W = 0, H = 0, P: Particle[] = [], small = false, raf = 0;
    let mouse: { x: number; y: number } | null = null;
    let BASE = "", HOT = "";

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      BASE = css.getPropertyValue("--cn-muted").trim() || "#8E968C";
      HOT = css.getPropertyValue("--cn-accent").trim() || "#FFB224";
    };

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const L = NANO.link, L2 = L * L;
      if (L > 0) {
        const paths: Particle[][] = [[], [], [], []];
        const hot: [Particle, Particle, number][] = [];
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          for (let j = i + 1; j < P.length; j++) {
            const q = P[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
            if (d2 > L2) continue;
            const a = 1 - Math.sqrt(d2) / L;
            if (p.h + q.h > 0.5) hot.push([p, q, a]);
            else paths[Math.min(3, (a * 4) | 0)].push(p, q);
          }
        }
        ctx!.lineWidth = 0.8;
        ctx!.strokeStyle = BASE;
        paths.forEach((s, i) => {
          if (!s.length) return;
          ctx!.globalAlpha = (i + 1) * 0.08;
          ctx!.beginPath();
          for (let j = 0; j < s.length; j += 2) { ctx!.moveTo(s[j].x, s[j].y); ctx!.lineTo(s[j + 1].x, s[j + 1].y); }
          ctx!.stroke();
        });
        ctx!.strokeStyle = HOT;
        for (const [p, q, a] of hot) {
          ctx!.globalAlpha = a * Math.min(1, (p.h + q.h) * 0.5) * 0.95;
          ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 0.8;
      ctx!.fillStyle = BASE;
      ctx!.beginPath();
      for (const p of P) { ctx!.moveTo(p.x + p.r, p.y); ctx!.arc(p.x, p.y, p.r, 0, 6.283); }
      ctx!.fill();
      ctx!.fillStyle = HOT;
      for (const p of P) {
        if (p.h < 0.04) continue;
        ctx!.globalAlpha = Math.min(1, p.h * 1.4);
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r + p.h * 1.8, 0, 6.283); ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function size() {
      W = cv!.offsetWidth; H = cv!.offsetHeight;
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv!.width = Math.round(W * dpr); cv!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = coarse || W < 640;
      const n = Math.min(small ? NANO.mobileMax : NANO.max, Math.round((W * H) / (small ? NANO.mobileDensity : NANO.density)));
      const cols = Math.max(1, Math.round(Math.sqrt((n * W) / H))), rows = Math.max(1, Math.ceil(n / cols));
      const sx = W / cols, sy = H / rows;
      P = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const hx = (c + 0.5 + (Math.random() - 0.5) * 0.85) * sx, hy = (r + 0.5 + (Math.random() - 0.5) * 0.85) * sy;
        P.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: 0.9 + Math.random() * 1.3, ph: Math.random() * 6.283, sp: 0.4 + Math.random() * 0.6, h: 0 });
      }
      draw();
    }

    function step(t: number) {
      const R = NANO.radius, R2 = R * R, dir = NANO.mode === "attract" ? -1 : 1, k = NANO.speed * (small ? 0.6 : 1);
      for (const p of P) {
        const tx = p.hx + Math.cos(t * p.sp * 0.0006 * k + p.ph) * NANO.drift;
        const ty = p.hy + Math.sin(t * p.sp * 0.0005 * k + p.ph * 1.3) * NANO.drift;
        let ax = (tx - p.x) * NANO.spring, ay = (ty - p.y) * NANO.spring, heat = 0;
        if (mouse) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            let f = 1 - d / R;
            heat = f;
            f = f * f * NANO.force * dir;
            ax += (dx / d) * f; ay += (dy / d) * f;
          }
        }
        p.vx = (p.vx + ax) * NANO.damping; p.vy = (p.vy + ay) * NANO.damping;
        p.x += p.vx; p.y += p.vy;
        p.h += (heat - p.h) * 0.08;
      }
    }

    const frame = (t: number) => {
      raf = 0;
      if (document.hidden) return;
      step(t); draw();
      raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf && !reduce) raf = requestAnimationFrame(frame); };
    // The canvas is fixed at the viewport origin, so client coordinates are canvas coordinates.
    const point = (e: PointerEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) leave(); };
    const leave = () => { mouse = null; };
    const up = (e: PointerEvent) => { if (e.pointerType !== "mouse") leave(); };

    readColors();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    // A theme switch flips the tokens: re-read the colours (and repaint a still field).
    const mo = new MutationObserver(() => { readColors(); if (reduce) draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    size();

    if (!reduce) {
      document.addEventListener("visibilitychange", wake);
      window.addEventListener("pointermove", point, { passive: true });
      window.addEventListener("pointerdown", point, { passive: true });
      window.addEventListener("pointerup", up, { passive: true });
      window.addEventListener("pointercancel", leave, { passive: true });
      document.addEventListener("mouseout", out, { passive: true });
      window.addEventListener("blur", leave);
      wake();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", point);
      window.removeEventListener("pointerdown", point);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", leave);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return <canvas ref={ref} className="cn-nano" aria-hidden="true" />;
}

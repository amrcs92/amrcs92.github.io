"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Content } from "@/content/types";

type Ai = Content["ai"];

/* ---- Timing: tune here ---------------------------------------------------------
   STEP_MS    time each step takes (5 steps ≈ 6 s at 1200)
   TYPE_PART  share of a step spent typing the tool name; the progress line fills the rest */
const STEP_MS = 1200;
const TYPE_PART = 0.6;
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

const noop = () => () => {};

/**
 * The five AI-workflow steps as a pipeline run that plays once when scrolled into view:
 * each card types its `$ tool`, the progress line fills its fifth, then it flips to ✓ done.
 * The static HTML (search engines, no-JS, reduced motion) is the finished run.
 */
export function AiPipeline({ ai }: { ai: Ai }) {
  const n = ai.steps.length;
  const total = STEP_MS * n;
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useSyncExternalStore(noop, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  // -1 = waiting for the section to scroll into view; total = finished
  const [t, setT] = useState(-1);
  const animate = hydrated && !reduce;

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const e = Math.min(total, now - t0);
        setT(e);
        if (e < total) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [animate, total]);

  const time = animate ? t : total;
  const started = time >= 0;
  const finished = time >= total;
  const step = !started ? -1 : finished ? n - 1 : Math.floor(time / STEP_MS);
  const p = !started ? 0 : finished ? 1 : (time % STEP_MS) / STEP_MS;
  const lineP = ease(Math.max(0, (p - TYPE_PART) / (1 - TYPE_PART)));
  const overall = !started ? 0 : finished ? 1 : (step + lineP) / n;

  return (
    <div className="cn-run" ref={ref} data-anim={animate || undefined} data-done={finished || undefined}>
      <div className="cn-run-line" aria-hidden="true"><i style={{ width: `${overall * 100}%` }} /></div>
      <ol className="cn-pipe">
        {ai.steps.map((s, i) => {
          const state = !started || i > step ? "pending" : i < step ? "done" : "active";
          const label = !started || state === "pending" ? `${ai.step} ${i + 1}/${n}`
            : state === "done" ? ai.done
            : finished ? ai.shipped : ai.running;
          const typed = state === "pending" ? "" : state === "active" && !finished
            ? s.tool.slice(0, Math.ceil(Math.min(1, p / TYPE_PART) * s.tool.length)) : s.tool;
          const caret = state === "active" && (!finished || i === n - 1);
          return (
            <li key={s.t} className="panel" data-state={state} data-passed={started && i < step ? "" : undefined}>
              <span className="n">{label}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="tool" dir="ltr">
                <span className="cn-sr">$ {s.tool}</span>
                <span aria-hidden="true">$ {typed}{caret && <b className="cn-caret">▍</b>}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

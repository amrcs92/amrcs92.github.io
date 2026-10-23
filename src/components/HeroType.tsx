"use client";

import { useEffect, useState } from "react";

/* ---- Typing: tune here -------------------------------------------------------
   type      ms per character for name / title / line
   erase     ms per character when deleting
   hold      ms to keep the finished text before deleting the role and line and retyping them
   gap       ms pause between lines and before retyping */
const T = { type: [85, 45, 22], erase: 9, hold: 10000, gap: 380 };

/** Full text stays in the layout (invisible) so nothing jumps; the typed copy sits on top. */
function Typed({ full, n, caret }: { full: string; n: number; caret: boolean }) {
  return (
    <span className="tw">
      <span className="tw-ghost">{full}</span>
      <span className="tw-live" aria-hidden="true">{full.slice(0, n)}{caret && <span className="tw-caret" />}</span>
    </span>
  );
}

/** Hero typed like a terminal: the name once, then the role and line on a loop every `hold` ms.
    Static for reduced motion and before hydration. */
export function HeroType({ name, title, line }: { name: string; title: string; line: string }) {
  const parts = [name, title, line];
  const total = parts.reduce((a, p) => a + p.length, 0);
  const [n, setN] = useState(total);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lens = [name.length, title.length, line.length];
    let k = 0, dir = 1, t = 0;
    const tick = () => {
      if (dir > 0) {
        if (k >= lens[0] + lens[1] + lens[2]) { dir = -1; t = window.setTimeout(tick, T.hold); return; }
        k++; setN(k);
        const i = k <= lens[0] ? 0 : k <= lens[0] + lens[1] ? 1 : 2;
        const lineEnd = k === lens[0] || k === lens[0] + lens[1];
        t = window.setTimeout(tick, lineEnd ? T.gap : T.type[i]);
      } else {
        // The name stays: only the role and the line are erased.
        if (k <= lens[0]) { dir = 1; t = window.setTimeout(tick, T.gap); return; }
        k = Math.max(lens[0], k - 2); setN(k);
        t = window.setTimeout(tick, T.erase);
      }
    };
    // Start on the next tick: clear the server-rendered text, then type it back in.
    t = window.setTimeout(() => { setOn(true); setN(0); t = window.setTimeout(tick, 500); }, 0);
    return () => window.clearTimeout(t);
  }, [name, title, line]);

  // The caret sits in the part currently being typed (or erased); a finished line hands it to the next.
  const a = name.length, b = a + title.length;
  const at = n < a ? 0 : n < b ? 1 : 2;

  return (
    <div className={on ? "tw-on" : undefined}>
      <h1 className="cn-name"><Typed full={name} n={Math.min(n, a)} caret={on && at === 0} /></h1>
      <p className="cn-title"><Typed full={title} n={Math.max(0, Math.min(n - a, title.length))} caret={on && at === 1} /></p>
      <p className="cn-line"><Typed full={line} n={Math.max(0, n - b)} caret={on && at === 2} /></p>
    </div>
  );
}

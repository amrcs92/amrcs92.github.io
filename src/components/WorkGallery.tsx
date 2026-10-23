"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Gallery } from "@/content/types";
import { asset } from "@/site.config";
import { ChevronIcon, CloseIcon } from "@/components/icons";

/** Both theme variants render; CSS shows the one matching the active theme. */
function Pair({ dir, id, alt, thumb }: { dir: string; id: string; alt: string; thumb?: boolean }) {
  const [w, h] = thumb ? [640, 400] : [1600, 1000];
  return (["light", "dark"] as const).map((theme) => (
    // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
    <img key={theme} className={`shot-${theme}`} src={asset(`/work/${dir}/${id}-${theme}${thumb ? "-thumb" : ""}.webp`)}
      width={w} height={h} alt={alt} loading="lazy" decoding="async" />
  ));
}

/** Thumbnail grid of every screen, with a keyboard-friendly lightbox. */
export function WorkGallery({ g, dir }: { g: Gallery; dir: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const n = g.items.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  const open = (k: number) => { setI(k); ref.current?.showModal(); };
  const close = () => ref.current?.close();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const key = (e: KeyboardEvent) => {
      if (!dlg.open || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      const rtl = document.documentElement.dir === "rtl";
      go((e.key === "ArrowRight") !== rtl ? 1 : -1);
    };
    // A click on the backdrop lands on the dialog itself.
    const backdrop = (e: MouseEvent) => { if (e.target === dlg) dlg.close(); };
    window.addEventListener("keydown", key);
    dlg.addEventListener("click", backdrop);
    return () => { window.removeEventListener("keydown", key); dlg.removeEventListener("click", backdrop); };
  }, [go]);

  const cur = g.items[i];
  return (
    <div className="cn-gal">
      <div className="cn-gal-h">
        <p className="mono mut">{`# ${g.kicker}`} · {n}</p>
        <h4>{g.title}</h4>
        <p className="cn-gal-d">{g.desc}</p>
      </div>
      <ul className="cn-gal-grid">
        {g.items.map((it, k) => (
          <li key={it.id}>
            <button type="button" onClick={() => open(k)} aria-label={`${g.open}: ${it.t}`}>
              <Pair dir={dir} id={it.id} alt="" thumb />
              <span>{it.t}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="cn-gal-note mono mut">* {g.note}</p>

      <dialog ref={ref} className="cn-lb" aria-label={g.title}>
        <div className="cn-lb-bar">
          <span className="mono">{i + 1} {g.of} {n}</span>
          <b>{cur.t}</b>
          <button type="button" className="tg" onClick={close} aria-label={g.close}><CloseIcon /></button>
        </div>
        <div className="cn-lb-img"><Pair key={cur.id} dir={dir} id={cur.id} alt={cur.t} /></div>
        <div className="cn-lb-nav">
          <button type="button" className="tg" onClick={() => go(-1)} aria-label={g.prev}><span className="cn-rev"><ChevronIcon /></span>{g.prev}</button>
          <button type="button" className="tg" onClick={() => go(1)} aria-label={g.next}>{g.next}<ChevronIcon /></button>
        </div>
      </dialog>
    </div>
  );
}

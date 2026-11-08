"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { Content } from "@/content/types";
import { WorkGallery } from "@/components/WorkGallery";

type Job = Content["exp"]["items"][number];

/**
 * Experience as a `git branch` switcher: a list of jobs next to one detail panel.
 * Every job's panel is in the static HTML (search engines, ATS and screen readers read them all);
 * once hydrated, only the selected one shows. Without JavaScript all jobs simply stack.
 */
const noop = () => () => {};
const onHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };

export function ExperienceSwitcher({ items, label }: { items: Job[]; label: string }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = items.map((j, i) => `exp-${j.slug ?? i}`);
  // False in the static HTML, true once hydrated: until then every job shows.
  const ready = useSyncExternalStore(noop, () => true, () => false);
  // The address names the selected job (#exp-us-legalization), so it can be linked to.
  const fromHash = useSyncExternalStore(onHash, () => ids.indexOf(decodeURIComponent(location.hash.slice(1))), () => -1);
  const [picked, setPicked] = useState(0);
  const sel = fromHash >= 0 ? fromHash : picked;

  function pick(k: number, focus = false) {
    history.replaceState(null, "", `#${ids[k]}`); // no scroll, no hashchange event
    setPicked(k);
    if (focus) tabs.current[k]?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>, k: number) {
    const n = items.length;
    const rtl = document.documentElement.dir === "rtl";
    const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (next) { e.preventDefault(); pick((k + next + n) % n, true); }
    else if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    else if (e.key === "End") { e.preventDefault(); pick(n - 1, true); }
  }

  return (
    <div className="cn-xp" data-ready={ready || undefined}>
      <div className="panel cn-xp-nav">
        <p className="cn-xp-cmd" dir="ltr"><span className="acc">$</span> git branch</p>
        <div className="cn-xp-tabs" role="tablist" aria-label={label} aria-orientation="vertical">
          {items.map((j, k) => (
            <button
              key={ids[k]}
              ref={(el) => { tabs.current[k] = el; }}
              type="button"
              role="tab"
              id={`${ids[k]}-tab`}
              aria-controls={ids[k]}
              aria-selected={k === sel}
              tabIndex={k === sel ? 0 : -1}
              className="cn-xp-tab"
              onClick={() => pick(k)}
              onKeyDown={(e) => onKey(e, k)}
            >
              <span className="cn-xp-star" aria-hidden="true">{k === sel ? "*" : ""}</span>
              <span className="cn-xp-t">
                <b>{j.role}</b>
                <span className="cn-xp-org">{j.org}</span>
                <span className="cn-xp-date">{j.from} – {j.to}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="cn-xp-panels">
        {items.map((j, k) => (
          <section
            key={ids[k]}
            id={ids[k]}
            role={ready ? "tabpanel" : undefined}
            aria-labelledby={ready ? `${ids[k]}-tab` : undefined}
            tabIndex={ready ? 0 : undefined}
            hidden={ready && k !== sel}
            className="panel cn-xp-panel"
          >
            <div className="cn-xp-bar">
              <span dir="ltr"><span className="acc">$</span> git show {j.slug ?? k}</span>
              {k === 0 && <span className="cn-xp-head" dir="ltr">HEAD → main</span>}
            </div>
            <div className="cn-xp-body">
              <p className="cn-xp-when">{j.from} – {j.to}</p>
              <h3>{j.role}</h3>
              <p className="cn-org">{j.org}</p>
              {j.points.length > 0 && (
                <ul className="cn-diff">{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
              )}
            </div>
            {j.gallery && (
              <div className="cn-xp-gal">
                <WorkGallery g={j.gallery} dir="monglish-edulixa360" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

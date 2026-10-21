"use client";

import { useEffect, useRef } from "react";
import { MoonIcon, SunIcon } from "./icons";

export const THEME_KEY = "theme";

/** Runs in <head> before paint: the visitor's stored choice, else the system setting. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

function stored(): string | null {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const label = () => btn.current?.setAttribute("aria-label", root.getAttribute("data-theme") === "dark" ? toLight : toDark);
    label();
    // Until the visitor picks a theme, keep following the system setting.
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => { if (!stored()) { root.setAttribute("data-theme", mq.matches ? "dark" : "light"); label(); } };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, [toDark, toLight]);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    btn.current?.setAttribute("aria-label", next === "dark" ? toLight : toDark);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage unavailable: the choice lasts this visit */ }
  }

  // Both icons render; CSS shows the one for the current theme, so the static HTML never mismatches.
  return (
    <button ref={btn} type="button" className="tg" onClick={toggle} aria-label={toDark}>
      <span className="theme-icon-moon"><MoonIcon /></span>
      <span className="theme-icon-sun"><SunIcon /></span>
    </button>
  );
}

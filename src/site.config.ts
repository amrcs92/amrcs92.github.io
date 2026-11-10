/** Deployed at the root of https://amrashraf.dev (repo amrcs92/amrcs92.github.io), so there is no base path. */
export const basePath = "";
export const siteUrl = "https://amrashraf.dev";

/** Prefix a file in /public with the base path (plain <img>/<a> don't add it on their own). */
export const asset = (path: string) => `${basePath}${path}`;

export const links = {
  github: "https://github.com/amrcs92",
  linkedin: "https://www.linkedin.com/in/amrashrafserageldin92",
  email: "mailto:amrcs1992@gmail.com",
  emailText: "amrcs1992@gmail.com",
  cv: asset("/cv/amr-ashraf-serag-eldin-cv.pdf"),
};

/** Each app has its own public site; its latest release carries the APK (the app repos themselves are private). */
const apk = (repo: string, file: string) => `https://github.com/amrcs92/${repo}/releases/latest/download/${file}`;

export type ProjectId = "cartopia" | "dawa2" | "fakkerni" | "claude-usage-tray";

/** `apk` is the main button: a download (an .exe when `kind` is "exe") or a video tour when `kind` is "video"; `view` is the project site, or the source repo when `code` is set. */
export const projectLinks: Record<ProjectId, { apk: string; kind?: "exe" | "video"; code?: boolean; view?: { en: string; ar: string } }> = {
  cartopia: {
    apk: "https://youtu.be/kiOWb290oNQ",
    kind: "video",
    code: true,
    view: { en: "https://github.com/amrcs92/cartopia", ar: "https://github.com/amrcs92/cartopia" },
  },
  dawa2: {
    apk: apk("dawa2-site", "dawa2.apk"),
    view: { en: `${siteUrl}/dawa2-site/`, ar: `${siteUrl}/dawa2-site/ar/` },
  },
  fakkerni: {
    apk: apk("fakkerni-site", "fakkerni.apk"),
    view: { en: `${siteUrl}/fakkerni-site/`, ar: `${siteUrl}/fakkerni-site/ar/` },
  },
  "claude-usage-tray": {
    apk: "https://github.com/amrcs92/claude-usage-tray/releases/latest/download/ClaudeUsageTray.exe",
    kind: "exe",
    code: true,
    view: { en: "https://github.com/amrcs92/claude-usage-tray", ar: "https://github.com/amrcs92/claude-usage-tray" },
  },
};

export const shotSize: Record<ProjectId, [number, number]> = { cartopia: [1200, 750], dawa2: [540, 1125], fakkerni: [540, 1200], "claude-usage-tray": [364, 541] };
export const shotNames: Record<ProjectId, [string, string]> = { cartopia: ["shop", "checkout"], dawa2: ["today", "alarm"], fakkerni: ["home", "medication"], "claude-usage-tray": ["dashboard", "dashboard-high"] };

/** Web projects: landscape .webp screens of an English-only UI, stacked instead of side by side. */
export const wideShots: Partial<Record<ProjectId, true>> = { cartopia: true };

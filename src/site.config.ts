/** Deployed at https://amrcs92.github.io/portfolio — change basePath if the repo is renamed. */
export const basePath = "/portfolio";
export const siteUrl = "https://amrcs92.github.io";

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

export type ProjectId = "dawa2" | "fakkerni";

export const projectLinks: Record<ProjectId, { apk: string; view?: { en: string; ar: string } }> = {
  dawa2: {
    apk: apk("dawa2-site", "dawa2.apk"),
    view: { en: "https://amrcs92.github.io/dawa2-site/", ar: "https://amrcs92.github.io/dawa2-site/ar/" },
  },
  fakkerni: {
    apk: apk("fakkerni-site", "fakkerni.apk"),
    view: { en: "https://amrcs92.github.io/fakkerni-site/", ar: "https://amrcs92.github.io/fakkerni-site/ar/" },
  },
};

export const shotSize: Record<ProjectId, [number, number]> = { dawa2: [540, 1125], fakkerni: [540, 1200] };
export const shotNames: Record<ProjectId, [string, string]> = { dawa2: ["today", "alarm"], fakkerni: ["home", "medication"] };

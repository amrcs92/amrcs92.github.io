import type { ProjectId } from "@/site.config";

/** A job's screenshot gallery: images live at /work/{dir}/{id}-{theme}[-thumb].webp. */
export type Gallery = Record<"title" | "kicker" | "desc" | "note" | "open" | "close" | "prev" | "next" | "of", string> & { items: { id: string; t: string }[] };

/** Shape of messages/{en,ar}.json — the whole page's copy. */
export type Content = {
  lang: "en" | "ar";
  dir: "ltr" | "rtl";
  other: string;
  otherCode: "en" | "ar";
  nav: { work: string; ai: string; exp: string; skills: string; contact: string };
  ui: Record<"toDark" | "toLight" | "langAria" | "menu" | "built" | "how" | "apk" | "view" | "present" | "email" | "top" | "screens" | "status" | "role" | "based" | "exp" | "stack" | "langs", string>;
  hero: Record<"first" | "last" | "name" | "short" | "mono" | "title" | "location" | "years" | "line" | "cv" | "github" | "contact" | "stack" | "langs" | "status", string>;
  work: { kicker: string; title: string; intro: string; crew: { cmd: string; rows: [string, string][] } };
  projects: { id: ProjectId; name: string; alt: string; color: string; tagline: string; desc: string; status: string; how: string; shots: [string, string]; tags: string[] }[];
  ai: { kicker: string; title: string; lead: string; steps: { t: string; d: string; tool: string }[]; noteTitle: string; note: string };
  exp: { kicker: string; title: string; items: { org: string; role: string; from: string; to: string; y: string; points: string[]; gallery?: Gallery }[] };
  skills: { kicker: string; title: string; groups: string[]; items: string[][] };
  edu: { kicker: string; title: string; items: { degree: string; school: string; year: string }[] };
  contact: { kicker: string; title: string; line: string; cta: string };
  footer: { rights: string; built: string };
};

import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { basePath, links, projectLinks, siteUrl } from "@/site.config";

// Required by `output: "export"` so the sitemap is written to out/sitemap.xml at build time.
export const dynamic = "force-static";

const url = (path: string) => `${siteUrl}${basePath}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, url(`/${l}/`)])),
    "x-default": url(`/${routing.defaultLocale}/`),
  };
  const lastModified = new Date();

  return [
    ...routing.locales.map((locale) => ({
      url: url(`/${locale}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? 1 : 0.9,
      alternates: { languages },
    })),
    // The project sites live under this domain too; projects with `code` set link to a repo instead.
    ...Object.values(projectLinks).flatMap(({ view, code }) => {
      if (!view || code) return [];
      const alternates = { languages: { en: view.en, ar: view.ar, "x-default": view.en } };
      return [
        { url: view.en, lastModified, changeFrequency: "monthly" as const, priority: 0.8, alternates },
        { url: view.ar, lastModified, changeFrequency: "monthly" as const, priority: 0.7, alternates },
      ];
    }),
    { url: `${siteUrl}${links.cv}`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}

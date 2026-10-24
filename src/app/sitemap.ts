import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { basePath, links, siteUrl } from "@/site.config";

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
    { url: `${siteUrl}${links.cv}`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}

import { routing } from "@/i18n/routing";
import { basePath, links, siteUrl } from "@/site.config";

// Written by hand instead of `sitemap.ts`, which can't add the <?xml-stylesheet?> line
// that makes browsers render the sitemap as a table (public/sitemap.xsl).
export const dynamic = "force-static";

const url = (path: string) => `${siteUrl}${basePath}${path}`;

type Entry = { loc: string; changefreq: string; priority: number; alternates?: Record<string, string> };

export function GET() {
  const languages: Record<string, string> = {
    ...Object.fromEntries(routing.locales.map((l) => [l, url(`/${l}/`)])),
    "x-default": url(`/${routing.defaultLocale}/`),
  };
  const entries: Entry[] = [
    ...routing.locales.map((locale) => ({
      loc: url(`/${locale}/`),
      changefreq: "monthly",
      priority: locale === routing.defaultLocale ? 1 : 0.9,
      alternates: languages,
    })),
    { loc: `${siteUrl}${links.cv}`, changefreq: "yearly", priority: 0.5 },
  ];
  const lastmod = new Date().toISOString();

  const body = entries
    .map((e) =>
      [
        "<url>",
        `<loc>${e.loc}</loc>`,
        ...Object.entries(e.alternates ?? {}).map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`),
        `<lastmod>${lastmod}</lastmod>`,
        `<changefreq>${e.changefreq}</changefreq>`,
        `<priority>${e.priority}</priority>`,
        "</url>",
      ].join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${basePath}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

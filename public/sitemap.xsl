<?xml version="1.0" encoding="UTF-8"?>
<!-- Renders /sitemap.xml as a readable page in browsers. Search engines ignore it and read the raw XML. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sm xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Sitemap · amrcs92.github.io</title>
        <style>
          :root { color-scheme: light dark; --bg: #fafafa; --fg: #18181b; --muted: #71717a; --line: #e4e4e7; --card: #fff; --accent: #2563eb; }
          @media (prefers-color-scheme: dark) {
            :root { --bg: #09090b; --fg: #f4f4f5; --muted: #a1a1aa; --line: #27272a; --card: #18181b; --accent: #60a5fa; }
          }
          * { box-sizing: border-box; }
          body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
          main { max-width: 960px; margin: 0 auto; padding: 40px 16px; }
          h1 { margin: 0 0 4px; font-size: 24px; }
          p { margin: 0 0 24px; color: var(--muted); }
          a { color: var(--accent); text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .table { overflow-x: auto; background: var(--card); border: 1px solid var(--line); border-radius: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 12px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }
          tr:last-child td { border-bottom: 0; }
          th { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
          .alt { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
          .tag { font-size: 12px; padding: 1px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); }
          .num { white-space: nowrap; color: var(--muted); }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p>
            <xsl:value-of select="count(sm:urlset/sm:url)" /> URLs. This page is the XML sitemap that search engines read, styled for people.
          </p>
          <div class="table">
            <table>
              <thead>
                <tr><th>URL</th><th>Last modified</th><th>Frequency</th><th>Priority</th></tr>
              </thead>
              <tbody>
                <xsl:for-each select="sm:urlset/sm:url">
                  <tr>
                    <td>
                      <a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a>
                      <xsl:if test="xhtml:link">
                        <div class="alt">
                          <xsl:for-each select="xhtml:link">
                            <a class="tag" href="{@href}" title="{@href}"><xsl:value-of select="@hreflang" /></a>
                          </xsl:for-each>
                        </div>
                      </xsl:if>
                    </td>
                    <td class="num"><xsl:value-of select="concat(substring(sm:lastmod, 1, 10), ' ', substring(sm:lastmod, 12, 5))" /></td>
                    <td class="num"><xsl:value-of select="sm:changefreq" /></td>
                    <td class="num"><xsl:value-of select="sm:priority" /></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

import { basePath } from "@/site.config";

export default function NotFound() {
  return (
    <html lang="en" data-theme="dark">
      <body className="cn" style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "ui-monospace, monospace" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: "var(--cn-muted)" }}>404 · not found</p>
          <p><a href={`${basePath}/en/`} style={{ color: "var(--cn-accent)" }}>~/home</a> · <a href={`${basePath}/ar/`} style={{ color: "var(--cn-accent)" }}>العربية</a></p>
        </main>
      </body>
    </html>
  );
}

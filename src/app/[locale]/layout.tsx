import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { themeScript } from "@/components/ThemeToggle";
import { basePath, siteUrl } from "@/site.config";
import type { Content } from "@/content/types";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-plex-arabic", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  setRequestLocale(locale);
  const c = (await getMessages()) as unknown as Content;
  return {
    metadataBase: new URL(siteUrl),
    title: `${c.hero.name} — ${c.hero.title}`,
    description: c.hero.line,
    alternates: {
      canonical: `${basePath}/${locale}/`,
      languages: { en: `${basePath}/en/`, ar: `${basePath}/ar/`, "x-default": `${basePath}/en/` },
    },
    openGraph: {
      type: "profile",
      title: `${c.hero.name} — ${c.hero.title}`,
      description: c.hero.line,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: `${basePath}/${locale}/`,
    },
    icons: {
      icon: [
        { url: `${basePath}/icon.svg`, type: "image/svg+xml" },
        { url: `${basePath}/favicon.ico`, sizes: "48x48" },
      ],
      apple: `${basePath}/apple-icon.png`,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} data-theme="light" suppressHydrationWarning className={`${plexSans.variable} ${plexMono.variable} ${plexArabic.variable}`}>
      <head>
        {/* Sets data-theme before first paint: no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

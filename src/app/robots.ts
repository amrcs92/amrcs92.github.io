import type { MetadataRoute } from "next";
import { basePath, siteUrl } from "@/site.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}${basePath}/sitemap.xml`,
  };
}

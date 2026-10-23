import path from "node:path";
import type { NextConfig } from "next";
import { basePath } from "./src/site.config";

// What `createNextIntlPlugin` sets up, done by hand: the plugin eagerly loads @swc/core
// (only needed for its experimental message extraction), whose native binary can fail to load on some Windows setups.
const intlRequestConfig = "./src/i18n/request.ts";

const nextConfig: NextConfig = {
  // Static HTML for GitHub Pages: one folder per locale at the site root.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    _next_intl_trailing_slash: "true",
    _next_intl_base_path: basePath,
  },
  turbopack: {
    resolveAlias: { "next-intl/config": intlRequestConfig },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = { ...config.resolve.alias, "next-intl/config": path.resolve(intlRequestConfig) };
    return config;
  },
};

export default nextConfig;

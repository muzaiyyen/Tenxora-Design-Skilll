import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a self-contained static copy (used for shareable previews and the WordPress theme).
// ASSET_PREFIX sets where the built files are served from; the WordPress build points it at the theme folder.
const exporting = process.env.STATIC_EXPORT === "1";
const assetPrefix = process.env.ASSET_PREFIX ?? ".";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  ...(exporting ? { output: "export", assetPrefix, images: { unoptimized: true } } : {}),
} as NextConfig;

export default nextConfig;

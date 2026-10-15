import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a self-contained static copy (used for shareable previews).
const exporting = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  ...(exporting ? { output: "export", assetPrefix: ".", images: { unoptimized: true } } : {}),
} as NextConfig;

export default nextConfig;

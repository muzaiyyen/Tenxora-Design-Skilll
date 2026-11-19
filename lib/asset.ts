// Public files are referenced through this so a static export can be hosted under any path.
const base = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";
export const asset = (p: string) => `${base}${p}`;

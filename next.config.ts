import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't select an unrelated lockfile
  // (a stray package-lock.json in the home directory) as the root.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

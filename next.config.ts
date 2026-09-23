import type { NextConfig } from "next";

// Set by the GitHub Pages workflow (e.g. "/athlete-wip"); empty locally.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export, so the site can be hosted on GitHub Pages.
  output: "export",
  basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Lets league statuses render consistently before the browser takes over.
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;

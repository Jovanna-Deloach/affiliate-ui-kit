import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product imagery is served from merchant CDNs in production; register them here.
    remotePatterns: [],
    // SVG fixtures are used in Storybook & the kit index page only.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

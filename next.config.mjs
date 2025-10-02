// next.config.mjs
/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // allow Next.js runtime, Vercel, and embeds
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://*.substack.com https://cdn.vercel-insights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.cdninstagram.com https://www.instagram.com https://*.substack.com https://substackcdn.com",
      "connect-src 'self' https://graph.instagram.com https://*.substack.com https://vitals.vercel-insights.com",
      "frame-src https://www.instagram.com https://*.substack.com",
      "font-src 'self' data:",
      "base-uri 'self'",
      "form-action 'self' https://*.substack.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "www.instagram.com" },
      { protocol: "https", hostname: "substackcdn.com" },
      { protocol: "https", hostname: "**.substack.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;

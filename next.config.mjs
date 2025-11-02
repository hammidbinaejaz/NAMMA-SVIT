import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },

  webpack: (config, { isServer }) => {
    // ✅ Always resolve @ to /src
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    // ✅ Absolute fallback for Vercel weirdness
    config.resolve.modules = [
      path.resolve(__dirname, "src"),
      "node_modules",
    ];

    // ✅ Fix optional Node libs when using Prisma
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;

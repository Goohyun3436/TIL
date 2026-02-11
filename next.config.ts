import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // GitHub Pages는 정적 export 필요
  trailingSlash: true, // 라우팅 안정화
  images: { unoptimized: true }, // next/image 서버 최적화가 없으니 끔
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
};

export default nextConfig;

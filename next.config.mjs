/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 型エラーを無視
  },
  eslint: {
    ignoreDuringBuilds: true, // Lintエラーを無視
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← Esto ignora errores ESLint en producción
  },
};

module.exports = nextConfig;

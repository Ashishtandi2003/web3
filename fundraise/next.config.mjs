/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.pinata.cloud'], // Adding Pinata domain
  },
};

export default nextConfig;

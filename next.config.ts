import type { NextConfig } from "next";


// next.config.js
console.log('Using API URL:', process.env.NEXT_PUBLIC_API_URL);

module.exports = {
  reactStrictMode: true,
};


const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

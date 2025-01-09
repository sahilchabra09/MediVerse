/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['assets.aceternity.com','images.unsplash.com' ,'img.clerk.com'], // Add the domain that you want to allow
    },
    experimental: {
      appDir: true,
    },
  };
  
  export default nextConfig;

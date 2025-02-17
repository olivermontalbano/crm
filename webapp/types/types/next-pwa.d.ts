// types/next-pwa.d.ts

declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    // Add other `next-pwa` options here as needed
  }

  function withPWA<P extends NextConfig = NextConfig>(
    options: PWAOptions
  ): (nextConfig?: P) => P;

  export default withPWA;
}

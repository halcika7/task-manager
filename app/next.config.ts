import bundler from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import nextIntlPlugin from 'next-intl/plugin';

const withNextIntl = nextIntlPlugin('./src/modules/i18n/request.ts');

const config: NextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  compiler: {
    // reactRemoveProperties: process.env.NODE_ENV === 'production',
    // removeConsole:
    //   process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    webVitalsAttribution: ['CLS', 'FCP', 'LCP', 'TTFB', 'FID', 'INP'],
    appDocumentPreloading: true,
    gzipSize: true,
    optimisticClientCache: true,
    optimizeServerReact: true,
    serverComponentsHmrCache: true,
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

const getConfig = () => {
  let configuration = config;

  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = bundler({
      enabled: true,
      openAnalyzer: true,
    });
    configuration = withBundleAnalyzer(config);
  }

  return withNextIntl(configuration);
};

export default getConfig();

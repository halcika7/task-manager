import type { MetadataRoute } from 'next';
import { config } from '@/modules/i18n/utils/config';

const authRoutes = ['login', 'register', 'forgot-password', 'reset-password'];

const authRoutesByLocale = config.locales.flatMap(locale =>
  authRoutes.map(route => `/${locale}/${route}`)
);

const landingRoutes = config.locales.map(locale => `/${locale}`);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [...authRoutesByLocale, ...landingRoutes],
        disallow: ['/dashboard', '/*dashboard*'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/sitemap.xml`,
  };
}

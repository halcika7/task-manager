import type { MetadataRoute } from 'next';

import { config } from '@/modules/i18n/utils/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages = config.locales.map(locale => ({
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${locale}`,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly' as const,
  }));

  return [...landingPages];
}

'use client';

import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { cn } from '@/shared/utils/cn';

const TextGenerateEffect = dynamic(
  () =>
    import('@/shared/components/ui/text-generate-effect').then(
      mod => mod.TextGenerateEffect
    ),
  {
    loading: () => <LoadingSpinner size="sm" className="mx-auto" />,
    ssr: false,
  }
);

const TracingBeam = dynamic(
  () =>
    import('@/shared/components/ui/tracing-beam').then(mod => mod.TracingBeam),
  {
    loading: () => (
      <div className="mx-auto max-w-5xl">
        <LoadingSpinner size="lg" className="mx-auto" />
      </div>
    ),
    ssr: false,
  }
);

const FeatureIcons = dynamic(() => import('./feature-icons'), {
  loading: () => <LoadingSpinner size="sm" className="mx-auto" />,
  ssr: false,
});

const features = [
  {
    key: 'taskOrganization',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    key: 'teamCollaboration',
    className: 'md:col-span-1',
  },
  {
    key: 'kanbanBoards',
    className: 'md:col-span-1',
  },
  {
    key: 'timeTracking',
    className: 'md:col-span-1',
  },
  {
    key: 'smartFilters',
    className: 'md:col-span-1',
  },
  {
    key: 'calendarView',
    className: 'md:col-span-1 md:row-span-2',
  },
  {
    key: 'customTags',
    className: 'md:col-span-1',
  },
  {
    key: 'multipleViews',
    className: 'md:col-span-1',
  },
];

const viewPort = { once: true, margin: '-100px' };
const getVariants = (idx: number) => ({
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.4,
      delay: idx * 0.2,
      ease: 'easeOut',
    },
  },
});

export default function Features() {
  const t = useTranslations('home.features');
  return (
    <div className="bg-background relative w-full py-20">
      <TracingBeam className="mx-auto max-w-5xl">
        <div className="ml-12 space-y-12">
          <TextGenerateEffect
            words={t('title')}
            className="text-foreground text-center text-4xl font-bold md:text-5xl"
          />
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {features.map((feature, idx) => (
              <m.div
                key={feature.key}
                variants={getVariants(idx)}
                className={cn(
                  'group border-border from-background to-card dark:from-card dark:to-card/80 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8',
                  feature.className
                )}
              >
                <div className="relative z-10 h-full">
                  <div className="mb-2 flex items-center gap-2">
                    <FeatureIcons iconKey={feature.key} />
                    <h3 className="text-foreground text-xl font-semibold">
                      {t(`items.${feature.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {t(`items.${feature.key}.description`)}
                  </p>
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-800/20" />
              </m.div>
            ))}
          </m.div>
        </div>
      </TracingBeam>
    </div>
  );
}

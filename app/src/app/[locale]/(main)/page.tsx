import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

import Hero from '@/modules/landing-page/components/hero';

const Features = dynamic(
  () => import('@/modules/landing-page/components/features')
);
const Testimonials = dynamic(
  () => import('@/modules/landing-page/components/testimonials')
);
const Workflow = dynamic(
  () => import('@/modules/landing-page/components/workflow')
);

type Props = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function LandingPage() {
  return (
    <>
      <Hero />

      <Features />
      <Testimonials />
      <Workflow />
    </>
  );
}

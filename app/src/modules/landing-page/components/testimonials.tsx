'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const TextGenerateEffect = dynamic(() =>
  import('@/shared/components/ui/text-generate-effect').then(
    mod => mod.TextGenerateEffect
  )
);

const InfiniteMovingCards = dynamic(() =>
  import('@/shared/components/ui/infinite-moving-cards').then(
    mod => mod.InfiniteMovingCards
  )
);

const testimonials = [
  {
    quote:
      'This task management app has transformed how our team works. The interface is intuitive and the features are exactly what we needed.',
    name: 'Sarah Chen',
    title: 'Product Manager at TechCorp',
  },
  {
    quote:
      "I've tried many task management tools, but this one stands out. The real-time collaboration features are game-changing.",
    name: 'Michael Rodriguez',
    title: 'Team Lead at InnovateCo',
  },
  {
    quote:
      'The ability to organize tasks with different views has made project management so much easier. Highly recommended!',
    name: 'Emily Thompson',
    title: 'Startup Founder',
  },
  {
    quote:
      'Clean, efficient, and powerful. This is exactly what a modern task management tool should be.',
    name: 'David Park',
    title: 'Engineering Manager',
  },
];

export default function Testimonials() {
  const t = useTranslations('home.testimonials');
  return (
    <section className="bg-background flex min-h-[40rem] flex-col items-center justify-center py-20">
      <TextGenerateEffect
        words={t('title')}
        className="text-foreground mb-12 text-center text-4xl font-bold md:text-5xl"
      />
      <div className="relative flex w-full flex-1 items-center justify-center">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
}

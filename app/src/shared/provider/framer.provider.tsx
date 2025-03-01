'use client';

import { LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = Readonly<{
  children: ReactNode;
}>;

const domAnimationPromise = () =>
  import('@/shared/utils/dom-animations').then(mod => mod.default);

export default function FramerProvider({ children }: Props) {
  return <LazyMotion features={domAnimationPromise}>{children}</LazyMotion>;
}

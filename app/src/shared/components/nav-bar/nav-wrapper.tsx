'use client';

import { m, useScroll, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type Props = Readonly<{
  children: ReactNode;
}>;

function getRgbValues(cssVar: string): string {
  // Get the CSS variable value from the document root
  if (typeof window === 'undefined') return '255, 255, 255'; // Default for SSR
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
  return value;
}

export default function NavWrapper({ children }: Props) {
  const { scrollYProgress } = useScroll();
  const [bgRgb, setBgRgb] = useState('255, 255, 255');
  const [borderRgb, setBorderRgb] = useState('226, 232, 240');

  useEffect(() => {
    setBgRgb(getRgbValues('--background'));
    setBorderRgb(getRgbValues('--border'));
  }, []);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    [`rgba(${bgRgb}, 0)`, `rgba(${bgRgb}, 0.9)`]
  );

  const borderColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    [`rgba(${borderRgb}, 0)`, `rgba(${borderRgb}, 0.1)`]
  );

  return (
    <m.nav
      className="fixed top-0 right-0 left-0 z-50 container mx-auto flex h-16 items-center justify-between px-4 backdrop-blur-sm"
      style={{
        backgroundColor,
        borderBottom: '1px solid',
        borderColor,
      }}
    >
      {children}
    </m.nav>
  );
}

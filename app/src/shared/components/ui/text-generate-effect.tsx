'use client';

import { m } from 'motion/react';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/utils/cn';

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const [wordArray, setWordArray] = useState<string[]>([]);

  useEffect(() => {
    setWordArray(words.split(' '));
  }, [words]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={cn('font-bold', className)}>
      <m.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {wordArray.map((word, idx) => (
          <m.span
            key={idx}
            className="inline-block"
            variants={variants}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            {word}{' '}
          </m.span>
        ))}
      </m.div>
    </div>
  );
}

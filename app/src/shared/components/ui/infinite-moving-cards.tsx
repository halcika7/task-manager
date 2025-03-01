'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/utils/cn';

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [start, setStart] = useState(false);

  const initAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Reset the scroller
      scrollerRef.current.innerHTML = '';

      // Double the items for seamless scrolling
      const doubledContent = [
        ...scrollerContent,
        ...scrollerContent.map(item => item.cloneNode(true)),
      ];
      doubledContent.forEach(item => {
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(item);
        }
      });

      if (containerRef.current) {
        if (direction === 'left') {
          containerRef.current.style.setProperty(
            '--animation-direction',
            'forwards'
          );
        } else {
          containerRef.current.style.setProperty(
            '--animation-direction',
            'reverse'
          );
        }

        // Set animation duration based on speed
        const durationMap = {
          fast: '20s',
          normal: '40s',
          slow: '80s',
        };
        containerRef.current.style.setProperty(
          '--animation-duration',
          durationMap[speed]
        );
      }

      setStart(true);
    }
  }, [direction, speed]);

  useEffect(() => {
    initAnimation();

    // Reset animation when items change
    return () => {
      setStart(false);
    };
  }, [initAnimation, items]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="border-border from-background to-card dark:from-card dark:to-card/80 w-[350px] max-w-full flex-shrink-0 rounded-2xl border bg-gradient-to-br p-8 shadow-lg md:w-[450px]"
          >
            <blockquote>
              <p className="text-muted-foreground mt-4 text-sm [&:not(:first-child)]:mt-6">
                {item.quote}
              </p>
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="text-foreground text-base font-medium">
                  {item.name}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

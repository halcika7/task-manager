'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/utils/cn';

type Particle = {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
};

export function SparklesCore({
  id,
  background,
  minSize,
  maxSize,
  speed,
  className,
  particleDensity,
}: {
  id: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
  particleDensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setContext(ctx);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const generateParticles = () => {
      const particleCount = particleDensity || 100;
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size =
          Math.random() * (maxSize || 2 - (minSize || 0.5)) + (minSize || 0.5);
        const speedMultiplier = speed || 1;
        const dx = (Math.random() - 0.5) * speedMultiplier;
        const dy = (Math.random() - 0.5) * speedMultiplier;

        newParticles.push({ x, y, size, dx, dy });
      }

      setParticles(newParticles);
    };

    generateParticles();
  }, [maxSize, minSize, particleDensity, speed]);

  useEffect(() => {
    if (!context || !canvasRef.current) return;

    const animate = () => {
      if (!context || !canvasRef.current) return;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach(particle => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
        context.fill();

        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.dx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight)
          particle.dy *= -1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [context, particles, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background: background || 'transparent',
      }}
    />
  );
}

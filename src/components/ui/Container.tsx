import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

export function Container({
  size = 'xl',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
}: SectionProps) {
  return (
    <header className={cn(centered && 'text-center', 'max-w-3xl', centered && 'mx-auto', className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-500">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="mt-3 text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>
      ) : null}
    </header>
  );
}

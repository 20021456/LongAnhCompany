import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-md active:translate-y-px',
  ghost:
    'border border-ink/15 text-ink hover:border-brand-500 hover:text-brand-500 hover:bg-brand-50/40',
  outline:
    'border border-white/40 text-white hover:bg-white/10 hover:border-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

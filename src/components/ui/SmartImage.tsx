import NextImage from 'next/image';
import type { CSSProperties } from 'react';

/** A source next/image can optimize: a local path or a configured remote host. */
function isOptimizable(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  try {
    const { hostname } = new URL(src);
    return (
      hostname.endsWith('.amazonaws.com') ||
      hostname === 'res.cloudinary.com' ||
      hostname === 'images.unsplash.com'
    );
  } catch {
    return false;
  }
}

interface SmartImageProps {
  src: string;
  alt: string;
  /** Aspect-ratio hint for next/image; the displayed size comes from CSS. */
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image wrapper for the public site. Optimizable sources go through
 * `next/image` (WebP, responsive srcset, lazy loading); base64 data URLs and
 * unconfigured remote hosts — which next/image rejects at runtime — fall back
 * to a plain <img>.
 *
 * Either branch renders a bare <img> element, so the existing
 * `.wrapper img { ... }` rules in globals.css keep controlling layout.
 */
export function SmartImage({
  src,
  alt,
  width = 1200,
  height = 800,
  className,
  style,
  sizes = '100vw',
  priority,
}: SmartImageProps) {
  if (isOptimizable(src)) {
    return (
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

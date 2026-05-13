import type { SVGProps } from 'react';

export type IconName =
  | 'arrow'
  | 'plus'
  | 'check'
  | 'chevron'
  | 'globe'
  | 'leaf'
  | 'factory'
  | 'ship'
  | 'spark'
  | 'box'
  | 'drop'
  | 'grid'
  | 'pin'
  | 'phone'
  | 'mail'
  | 'sun'
  | 'moon';

const paths: Record<IconName, JSX.Element> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l4 4 10-10" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>
  ),
  leaf: <path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16zM4 20l8-8" />,
  factory: <path d="M3 21V11l6 4V11l6 4V7l6 4v10H3zM7 17h2M11 17h2M15 17h2" />,
  ship: <path d="M3 17l9-3 9 3M5 13V7l7-3 7 3v6M9 13V8M15 13V8M3 21h18" />,
  spark: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4" />,
  box: <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" />,
  drop: <path d="M12 3s-7 8-7 13a7 7 0 0014 0c0-5-7-13-7-13z" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  pin: (
    <>
      <path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  moon: <path d="M21 13a8 8 0 11-10-10 7 7 0 0010 10z" />,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

// Brand logo — uses the asset from prototype.
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: size,
        height: size,
        justifyContent: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/long-anh-logo.png"
        alt="Long Anh"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </span>
  );
}

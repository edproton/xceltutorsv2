import React from "react";

interface SvgProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Icon: React.FC<SvgProps> = ({
  width = 98,
  height = 87,
  className = "",
}) => (
  <svg viewBox="0 0 98 87" width={width} height={height} className={className}>
    <rect width="98" height="87" rx="10" fill="#ff5722" />
    <g
      transform="matrix(1.337307,0,0,1.337307,19.91976,-8.26914)"
      fill="#eeeeee"
    >
      <path d="M39.06 53.46c2.1 2.94 4.62 3.48 4.62 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-16.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.24-2.76 1.5-5.16l-7.44-10.26-6.78 10.26c-1.56 2.4 1.02 3.48 1.02 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-10.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.06-2.4 5.1-5.16l10.56-14.46-10.92-15.06c-2.22-3-4.62-3.48-4.62-5.16v-0.24c0-0.72 0.6-1.14 1.44-1.14h15.78c0.9 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.24 2.82-1.5 5.16l7.32 9.96 6.66-9.96c1.62-2.34-1.92-3.48-1.92-5.16v-0.24c0-0.72 0.54-1.14 1.44-1.14h11.04c0.84 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.54 2.28-5.58 5.16l-9.96 14.16z" />
    </g>
  </svg>
);

export default Icon;

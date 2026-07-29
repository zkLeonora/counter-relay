'use client';

import React from 'react';

export function RelayMark({ size = 32, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Relay"
      className="shrink-0"
    >
      <rect x="2" y="11" width="26" height="8" rx="4" fill={color} />
      <rect x="20" y="29" width="26" height="8" rx="4" fill={color} />
    </svg>
  );
}
